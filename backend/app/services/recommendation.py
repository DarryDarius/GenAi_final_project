"""
妆容推荐服务 - 综合面部分析 + RAG 检索结果，生成个性化妆容推荐
"""
from openai import OpenAI


def generate_recommendation(
    face_analysis: str,
    rag_context: list[str],
    client: OpenAI,
) -> str:
    """
    基于面部分析和 RAG 检索到的知识，生成个性化妆容推荐
    """
    context_text = "\n\n---\n\n".join(rag_context) if rag_context else "（暂无检索到的知识）"

    system_prompt = """你是一位专业、友善的美妆顾问。你的任务是根据用户的面部分析结果，结合检索到的美妆知识库内容，给出个性化妆容推荐。

要求：
1. 用中文回答，语气亲切专业
2. 必须结合「面部分析」和「知识库」中的内容，明确说明推荐理由（如：根据您的鹅蛋脸型…；您的暖皮适合…）
3. 推荐应包含：适合的妆容风格、修容/腮红/眉形建议、眼影/唇膏色系建议
4. 保持包容性，避免刻板印象；若某项特征难以判断，可给出多种可能性建议
5. 输出使用清晰的段落和小标题，方便阅读
6. 在回答末尾可简单注明「以上建议基于通用美妆知识，您可根据个人喜好调整」"""

    user_prompt = f"""## 面部分析结果（来自 AI 识图）

{face_analysis}

## 检索到的美妆知识库内容（RAG）

{context_text}

---

请根据上述面部分析和知识库，为用户生成一份个性化妆容推荐。务必引用知识库中的具体建议，并说明推荐理由。"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=1500,
    )
    return response.choices[0].message.content
