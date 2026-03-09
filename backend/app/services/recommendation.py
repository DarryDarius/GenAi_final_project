"""
Makeup recommendation service - combines face analysis + RAG retrieval to generate personalized recommendations
"""
from openai import OpenAI


def generate_recommendation(
    face_analysis: str,
    rag_context: list[str],
    client: OpenAI,
) -> str:
    """
    Generate personalized makeup recommendations based on face analysis and RAG-retrieved knowledge
    """
    context_text = "\n\n---\n\n".join(rag_context) if rag_context else "(No retrieved knowledge)"

    system_prompt = """You are a professional, friendly makeup consultant. Your task is to give personalized makeup recommendations based on the user's face analysis and retrieved makeup knowledge.

Requirements:
1. Write in English. Be warm and professional.
2. Cite both the face analysis and knowledge base explicitly (e.g., "For your oval face…"; "Your warm undertone suits…").
3. Include: suitable makeup styles, contour/blush/brow tips, eyeshadow/lip color suggestions.
4. Be inclusive; avoid stereotypes. If a feature is ambiguous, offer multiple options.
5. Use clear paragraphs and subheadings.
6. End with a brief note that suggestions are general guidance and can be adjusted to preference."""

    user_prompt = f"""## Face Analysis (from AI vision)

{face_analysis}

## Retrieved Makeup Knowledge (RAG)

{context_text}

---

Generate personalized makeup recommendations based on the above. Cite specific knowledge base suggestions and explain your reasoning."""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=1500,
    )
    return response.choices[0].message.content
