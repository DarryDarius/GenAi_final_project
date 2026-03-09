"""
Face analysis service - uses OpenAI Vision API to analyze face shape, skin tone, features
"""
import base64
from openai import OpenAI


def analyze_face(image_base64: str, client: OpenAI) -> str:
    """
    Analyze facial features and return structured description (face shape, skin tone, eye type)
    """
    prompt = """You are a professional makeup consultant. Analyze this face photo and output the following as pure JSON (no markdown, no code blocks):

{
  "face_shape": "Round/Square/Oblong/Diamond/Oval/Heart/unable to determine",
  "skin_tone": "Cool/Warm/Neutral undertone, plus depth (e.g., fair, medium, deep)",
  "eye_type": "Monolid/Double lid/Inner double, plus eye shape (e.g., upturned, downturned)",
  "other_features": "Other notable features affecting makeup (lip shape, cheekbones, glasses, etc.) in one sentence"
}

Important:
1. Make reasonable inferences from visible information. Face shape from outline (forehead, cheekbones, jaw); skin tone from exposed areas (forehead, cheeks) even with glasses.
2. Use "unable to determine" only when the photo is severely blurry, badly angled (e.g., side profile), or face is largely obscured.
3. Stay objective and professional; reasonable inference is encouraged, avoid being overly conservative."""

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
