"""
RAG 检索服务 - 从 ChromaDB 检索与用户特征相关的美妆知识
"""
from pathlib import Path

from openai import OpenAI
import chromadb


# ChromaDB 持久化目录
CHROMA_DIR = Path(__file__).resolve().parent.parent.parent / "chroma_db"


def get_collection():
    """获取 ChromaDB collection"""
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    return client.get_collection("makeup_knowledge")


def retrieve(
    query: str,
    client: OpenAI,
    collection,
    top_k: int = 6,
) -> list[str]:
    """
    根据查询文本检索相关美妆知识
    使用 OpenAI embedding 将 query 向量化，再在 ChromaDB 中相似度检索
    """
    resp = client.embeddings.create(
        model="text-embedding-3-small",
        input=query,
    )
    query_embedding = resp.data[0].embedding

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas"],
    )
    docs = results["documents"][0] if results["documents"] else []
    return docs
