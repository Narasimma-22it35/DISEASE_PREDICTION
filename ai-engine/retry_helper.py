import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Initialize the new SDK client
_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# A unified cascading fallback algorithm for Gemini Free Tier rate limit protection.
# Retries within the same model using Exponential Backoff, then cascades to other models.
MODEL_CASCADE = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
]


class _FakeResponse:
    """Simple wrapper to keep .text attribute interface consistent with callers."""
    def __init__(self, text: str):
        self.text = text


def generate_with_fallback(prompt_parts, max_retries=2, base_delay=5):
    """
    Robust wrapper for Gemini generate_content that includes Exponential Backoff
    and Model Fallback.
    Returns a response-like object with a .text attribute, or raises an Exception.

    Args:
        prompt_parts: list of strings and/or dicts with 'mime_type' + 'data' keys.
        max_retries: attempts per model before cascading.
        base_delay: base seconds for exponential backoff.
    """
    # Build the contents list accepted by the new SDK
    contents = _build_contents(prompt_parts)

    for model_name in MODEL_CASCADE:
        for attempt in range(max_retries):
            try:
                response = _client.models.generate_content(
                    model=model_name,
                    contents=contents,
                )
                # New SDK: response.text is directly accessible
                return _FakeResponse(response.text)

            except Exception as e:
                error_str = str(e)

                # 429 = Quota or Rate Limit hit
                if '429' in error_str or 'Quota exceeded' in error_str:
                    # If daily quota is fully exhausted, instant cascade
                    if 'PerDayPerProject' in error_str or 'GenerateRequestsPerDay' in error_str:
                        print(f"Daily quota depleted for {model_name}. Cascading to next model...")
                        break

                    if attempt < max_retries - 1:
                        sleep_time = base_delay * (2 ** attempt)
                        print(f"Rate limit on {model_name}. Retrying in {sleep_time}s...")
                        time.sleep(sleep_time)
                        continue

                print(f"Model {model_name} failed (attempt {attempt+1}). Error: {error_str}")
                break  # Try next model in cascade

    raise Exception("Critical: All fallback models and retries exhausted due to API errors.")


def _build_contents(prompt_parts):
    """
    Convert a list of strings and/or inline-data dicts into the format
    expected by the new google-genai SDK.

    Accepts:
      - str  -> plain text part
      - dict with 'mime_type' + 'data' (bytes) -> inline_data part
    """
    from google.genai import types

    parts = []
    for item in prompt_parts:
        if isinstance(item, str):
            parts.append(types.Part.from_text(text=item))
        elif isinstance(item, dict) and 'mime_type' in item and 'data' in item:
            parts.append(
                types.Part.from_bytes(
                    mime_type=item['mime_type'],
                    data=item['data'],
                )
            )
        else:
            # Fallback: coerce to string
            parts.append(types.Part.from_text(text=str(item)))

    return [types.Content(role="user", parts=parts)]
