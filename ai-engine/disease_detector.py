import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

def detect_diseases(patient_data: dict):
    """
    Analyzes patient data using Gemini to detect potential diseases.
    """
    # Format patient data for the prompt
    formatted_data = json.dumps(patient_data, indent=2)

    prompt = f"""
    You are an expert medical AI diagnostician.
    Analyze this patient's complete health data and identify ALL possible diseases or risks.
    
    Patient Data:
    {formatted_data}

    Return ONLY valid JSON with no extra text or code fences:
    {{
      "primary_disease": {{
        "name": "string",
        "risk_percentage": number,
        "severity": "LOW/MEDIUM/HIGH/CRITICAL",
        "confidence": number,
        "matching_symptoms": ["string"],
        "ml_model_available": boolean,
        "ml_model_key": "diabetes/heart/kidney/liver/hypertension/none",
        "explanation": "string"
      }},
      "other_diseases": [
        {{
          "name": "string",
          "risk_percentage": number,
          "severity": "string",
          "reason": "string",
          "ml_model_available": boolean,
          "ml_model_key": "string"
        }}
      ],
      "overall_health_score": number,
      "urgent_attention_needed": boolean,
      "urgent_reason": "string or null",
      "recommended_tests": ["string"],
      "specialist_referral": "string",
      "lifestyle_impact_summary": "string"
    }}

    Rules:
    - Set ml_model_available to true ONLY if the disease is one of: diabetes, heart disease, kidney disease, liver disease, or hypertension.
    - Set ml_model_key correctly to: diabetes, heart, kidney, liver, or hypertension.
    """

    try:
        from retry_helper import generate_with_fallback
        response = generate_with_fallback([prompt])
        text = response.text.strip()
        
        # Clean response text
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        raise Exception(f"GenAI Diagnostic Error: {str(e)}")
