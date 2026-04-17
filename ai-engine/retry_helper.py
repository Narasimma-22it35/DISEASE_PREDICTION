import time
import google.generativeai as genai

# A unified cascading fallback algorithm for Gemini Free Tier rate limit protection
# It retries within the same model using Exponential Backoff, and cascades to other 
# versions in the pipeline if the primary quota is completely depleted.
MODEL_CASCADE = ['models/gemini-flash-latest', 'models/gemini-2.5-flash-lite', 'models/gemini-pro-latest']

def generate_with_fallback(prompt_parts, max_retries=2, base_delay=5):
    """
    Robust wrapper for model.generate_content that includes Exponential Backoff and Model Fallback.
    Returns the successful response text, or raises an Exception.
    """
    for model_name in MODEL_CASCADE:
        model = genai.GenerativeModel(model_name)
        
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt_parts)
                return response
            except Exception as e:
                error_str = str(e)
                # 429 = Quota or Rate Limit hit
                if '429' in error_str or 'Quota exceeded' in error_str:
                    # If daily quota is hit, retrying is useless. Instantly jump to fallback model.
                    if 'PerDayPerProject' in error_str or 'GenerateRequestsPerDay' in error_str:
                        print(f"Daily quota completely depleted for {model_name}. Instant cascading...")
                        break

                    if attempt < max_retries - 1:
                        # Exponential backoff (10s, 20s, 40s)
                        sleep_time = base_delay * (2 ** attempt)
                        print(f"Rate limit hit on {model_name}. Retrying in {sleep_time}s...")
                        time.sleep(sleep_time)
                        continue
                
                # If it's not a rate limit error, or we ran out of retries for this model, we break and try the next model.
                print(f"Model {model_name} failed. Attempting next fallback... Error: {error_str}")
                break # Exit the retry loop, moves to the next model_name
                
    raise Exception("Critical: All fallback models and retries exhausted due to API Rate Limits.")
