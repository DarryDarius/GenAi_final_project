"""
RAG 知识库构建脚本
将美妆知识文档分块、嵌入、存入 ChromaDB
"""
import os
from pathlib import Path

from openai import OpenAI
import chromadb
from chromadb.config import Settings

# 项目根路径
BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data" / "makeup_knowledge"
CHROMA_DIR = BACKEND_ROOT / "chroma_db"


def load_documents() -> list[tuple[str, str]]:
    """加载所有 markdown 文档，返回 (content, source) 列表"""
    docs = []
    for md_file in DATA_DIR.glob("*.md"):
        content = md_file.read_text(encoding="utf-8")
        source = md_file.stem
        docs.append((content, source))
    return docs


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 80) -> list[str]:
    """按字符数分块，带重叠"""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        # 尽量在段落边界切分
        if end < len(text):
            last_newline = chunk.rfind("\n")
            if last_newline > chunk_size // 2:
                end = start + last_newline + 1
                chunk = text[start:end]
        chunks.append(chunk.strip())
        if chunk:
            start = end - overlap
        else:
            start = end
    return [c for c in chunks if c]


def build_rag(client: OpenAI, chroma_client: chromadb.PersistentClient):
    """构建 RAG 向量库"""
    try:
        chroma_client.delete_collection("makeup_knowledge")
    except Exception:
        pass
    collection = chroma_client.create_collection(
        name="makeup_knowledge",
        metadata={"description": "美妆推荐知识库"},
    )

    docs = load_documents()
    all_chunks: list[str] = []
    all_metadatas: list[dict] = []
    all_ids: list[str] = []

    chunk_id = 0
    for content, source in docs:
        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_metadatas.append({"source": source})
            all_ids.append(f"{source}_{i}_{chunk_id}")
            chunk_id += 1

    if not all_chunks:
        raise ValueError("没有加载到任何文档")

    # 批量嵌入 (OpenAI 限制每批最多 2048 个输入，这里每批 50 个更稳妥)
    batch_size = 50
    all_embeddings = []
    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i : i + batch_size]
        resp = client.embeddings.create(
            model="text-embedding-3-small",
            input=batch,
        )
        embeddings = [e.embedding for e in resp.data]
        all_embeddings.extend(embeddings)

    collection.add(
        ids=all_ids,
        embeddings=all_embeddings,
        documents=all_chunks,
        metadatas=all_metadatas,
    )
    print(f"已索引 {len(all_chunks)} 个文档块到 ChromaDB")
    return len(all_chunks)


def main():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("请设置环境变量 OPENAI_API_KEY")

    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
    client = OpenAI(api_key=api_key)

    build_rag(client, chroma_client)
    print("RAG 知识库构建完成")


if __name__ == "__main__":
    main()
