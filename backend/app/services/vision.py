"""
面部分析服务 - 使用 OpenAI Vision API 分析脸型、肤色、五官
"""
import base64
from openai import OpenAI


def analyze_face(image_base64: str, client: OpenAI) -> str:
    """
    分析用户面部特征，返回结构化描述（脸型、肤色、五官特点）
    """
    prompt = """你是一位专业的美妆顾问。请根据这张面部照片，用中文简洁分析以下内容，以 JSON 格式输出（不要输出 markdown 代码块，只输出纯 JSON）：

{
  "face_shape": "圆脸/方脸/长脸/菱形脸/鹅蛋脸/心形脸/无法判断",
  "skin_tone": "冷皮/暖皮/中性皮，以及肤色深浅（如：浅色、自然、深色）",
  "eye_type": "单眼皮/双眼皮/内双，以及眼型特点（如：丹凤眼、下垂眼等）",
  "other_features": "其他可能影响妆容的显著特征，如唇形、颧骨等，用一句话概括"
}

注意：如果照片不清晰或角度不合适导致难以判断，请将对应字段设为"无法判断"。保持客观、专业，避免过度主观描述。"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}",
                        },
                    },
                ],
            }
        ],
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()
