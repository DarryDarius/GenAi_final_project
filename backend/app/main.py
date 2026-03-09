"""
美妆推荐 API - FastAPI 入口
核心流程：上传照片 → Vision 分析 → RAG 检索 → LLM 推荐
"""
import base64
from pathlib import Path

# 加载 .env（在 backend 目录下有 .env 时）
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass
import json
import re
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

from app.services.vision import analyze_face
from app.services.rag import get_collection, retrieve
from app.services.recommendation import generate_recommendation

# 配置
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

# 全局 OpenAI 客户端（在 lifespan 中初始化）
client: OpenAI | None = None


def init_openai():
    import os
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise ValueError("请设置环境变量 OPENAI_API_KEY")
    return OpenAI(api_key=key)


def extract_rag_query(face_analysis: str) -> str:
    """从面部分析 JSON 中提取关键词，用于 RAG 检索"""
    try:
        # 尝试解析 JSON
        text = face_analysis.strip()
        # 移除可能的 markdown 代码块
        if "```" in text:
            text = re.sub(r"```\w*\n?", "", text)
        data = json.loads(text)
        parts = []
        if isinstance(data.get("face_shape"), str) and "无法判断" not in data["face_shape"]:
            parts.append(data["face_shape"])
        if isinstance(data.get("skin_tone"), str) and "无法判断" not in data["skin_tone"]:
            parts.append(data["skin_tone"])
        if isinstance(data.get("eye_type"), str) and "无法判断" not in data["eye_type"]:
            parts.append(data["eye_type"])
        if parts:
            return " ".join(parts) + " 适合的妆容 修容 腮红 眼影 唇膏"
    except (json.JSONDecodeError, TypeError):
        pass
    return "脸型 肤色 适合的妆容 修容 腮红 眼影 唇膏"


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    client = init_openai()
    yield
    client = None


app = FastAPI(
    title="美妆推荐 API",
    description="基于 RAG + Vision 的个性化妆容推荐",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "美妆推荐 API", "docs": "/docs"}


@app.post("/api/recommend")
async def recommend_makeup(file: UploadFile = File(...)):
    """
    上传面部照片，返回 AI 个性化妆容推荐
    流程：Vision 分析 → RAG 检索 → LLM 生成推荐
    """
    global client
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI 客户端未初始化")

    # 校验文件
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"仅支持 jpeg/png/webp，当前: {file.content_type}",
        )
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="文件不能超过 5MB")

    img_base64 = base64.b64encode(content).decode("utf-8")

    try:
        # 1. Vision 面部分析
        face_analysis = analyze_face(img_base64, client)

        # 2. RAG 检索
        rag_query = extract_rag_query(face_analysis)
        collection = get_collection()
        rag_docs = retrieve(rag_query, client, collection, top_k=6)

        # 3. LLM 生成推荐
        recommendation = generate_recommendation(face_analysis, rag_docs, client)

        return {
            "face_analysis": face_analysis,
            "rag_sources_count": len(rag_docs),
            "recommendation": recommendation,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
def health():
    return {"status": "ok"}
