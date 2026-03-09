# 美妆推荐 MVP · AI 个性化妆容

基于 **RAG（检索增强生成）** 的美妆推荐系统：用户上传面部照片 → AI 分析脸型/肤色/五官 → 从美妆知识库检索 → 生成个性化妆容推荐。

## 技术栈

- **RAG**：ChromaDB + OpenAI `text-embedding-3-small`，美妆知识库向量检索
- **Vision**：OpenAI GPT-4o-mini 分析面部特征
- **LLM**：OpenAI GPT-4o 综合 RAG 结果生成推荐
- **后端**：FastAPI
- **前端**：React + Vite + Tailwind

## 快速开始

### 1. 环境准备

```bash
# 克隆/进入项目
cd GenAI_final_project

# 设置 OpenAI API Key（必填）
export OPENAI_API_KEY="sk-xxx"
# 或创建 .env 文件（需自行加载，或使用 python-dotenv）
```

### 2. 构建 RAG 知识库（首次必须执行）

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python scripts/build_rag.py
```

会将 `data/makeup_knowledge/` 下的美妆文档分块、嵌入、存入 `chroma_db/`。

### 3. 启动后端

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

浏览器访问 http://localhost:3000，上传面部照片即可获得推荐。

## 项目结构

```
GenAI_final_project/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 入口，/api/recommend
│   │   └── services/
│   │       ├── vision.py        # Vision 面部分析
│   │       ├── rag.py           # RAG 检索（核心）
│   │       └── recommendation.py # LLM 推荐
│   ├── data/makeup_knowledge/   # 美妆知识文档（RAG 源）
│   ├── chroma_db/               # 向量库（build_rag.py 生成）
│   ├── scripts/build_rag.py     # RAG 构建脚本
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   └── ...
└── README.md
```

## RAG 流程说明

1. **知识库**：脸型、肤色、妆容风格、五官特点等 markdown 文档
2. **分块**：按 ~400 字符分块，重叠 80 字
3. **嵌入**：OpenAI `text-embedding-3-small` 向量化
4. **检索**：用户照片 → Vision 提取脸型/肤色/眼型 → 构造查询 → ChromaDB 相似度检索 top-6
5. **生成**：LLM 结合检索结果 + 分析结果 → 个性化妆容推荐

## 负责任 AI

- 照片仅用于分析，不长期存储
- 知识库覆盖多种肤色、脸型，prompt 强调包容
- 推荐附带理由，可追溯至知识库

## API

| 接口 | 说明 |
|------|------|
| `POST /api/recommend` | 上传照片，返回推荐（Content-Type: multipart/form-data, 字段: file） |
| `GET /api/health` | 健康检查 |
