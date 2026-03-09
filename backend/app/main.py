"""
Makeup Recommendation API - FastAPI entry
Flow: upload photo → Vision analysis → RAG retrieval → LLM recommendation
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
        raise ValueError("Please set OPENAI_API_KEY environment variable")
    return OpenAI(api_key=key)


def extract_rag_query(face_analysis: str) -> str:
    """Extract keywords from face analysis JSON for RAG retrieval"""
    try:
        text = face_analysis.strip()
        if "```" in text:
            text = re.sub(r"```\w*\n?", "", text)
        data = json.loads(text)
        parts = []
        for key in ("face_shape", "skin_tone", "eye_type"):
            val = data.get(key)
            if isinstance(val, str) and "unable to determine" not in val.lower():
                parts.append(val)
        if parts:
            return " ".join(parts) + " suitable makeup contour blush eyeshadow lipstick"
    except (json.JSONDecodeError, TypeError):
        pass
    return "face shape skin tone makeup contour blush eyeshadow lipstick"


@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    client = init_openai()
    yield
    client = None


app = FastAPI(
    title="Makeup Recommendation API",
    description="AI-powered makeup recommendations via RAG + Vision",
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
    return {"message": "Makeup Recommendation API", "docs": "/docs"}


@app.post("/api/recommend")
async def recommend_makeup(file: UploadFile = File(...)):
    """
    Upload face photo, return AI makeup recommendations
    Flow: Vision analysis → RAG retrieval → LLM recommendation
    """
    global client
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI client not initialized")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Only jpeg/png/webp supported, got: {file.content_type}",
        )
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must not exceed 5MB")

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
