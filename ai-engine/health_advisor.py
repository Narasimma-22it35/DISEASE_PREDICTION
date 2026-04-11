import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-pro')

def generate_health_plan(disease: str, risk_level: str, severity: str, patient_data: dict):
    """
    Generates a comprehensive, disease-specific health plan using Gemini.
    """
    formatted_data = json.dumps(patient_data, indent=2)

    prompt = f"""
    You are a medical health companion. Generate a complete, disease-specific health plan.
    Context:
    - Disease: {disease}
    - Risk Level: {risk_level}
    - Severity: {severity}
    - Patient Background: {formatted_data}

    Return ONLY valid JSON with no extra text or code fences:
    {{
      "overcome_tips": [
        {{ "title": "string", "description": "string", "icon": "string", "timeframe": "string", "priority": "string" }}
      ], // 6 items
      "pros_of_early_detection": [
        {{ "point": "string", "detail": "string", "impact": "string" }}
      ], // 5 items
      "cons_of_ignoring": [
        {{ "point": "string", "detail": "string", "consequence": "string" }}
      ], // 5 items
      "recommended_foods": [
        {{ "name": "string", "benefit": "string", "emoji": "string", "category": "string", "how_much": "string", "when_to_eat": "string" }}
      ], // 8 items
      "recommended_fruits": [
        {{ "name": "string", "benefit": "string", "emoji": "string", "glycemic_index": "string", "servings_per_day": "string" }}
      ], // 8 items
      "recommended_vegetables": [
        {{ "name": "string", "benefit": "string", "emoji": "string", "how_to_eat": "string", "servings_per_day": "string" }}
      ], // 8 items
      "foods_to_avoid": [
        {{ "name": "string", "reason": "string", "emoji": "string", "alternative": "string" }}
      ], // 6 items
      "dos": [
        {{ "action": "string", "frequency": "string", "detail": "string", "icon": "string", "scientific_reason": "string" }}
      ], // 7 items
      "donts": [
        {{ "action": "string", "reason": "string", "icon": "string", "risk_if_ignored": "string" }}
      ], // 7 items
      "exercise_plan": [
        {{ "name": "string", "duration": "string", "frequency": "string", "intensity": "string", "benefit": "string", "steps": ["string"], "youtube_search_query": "string", "emoji": "string", "best_time": "string", "calories_burned": "string" }}
      ], // 6 items
      "lifestyle_changes": [
        {{ "change": "string", "reason": "string", "difficulty": "string", "impact": "string" }}
      ], // 5 items
      "warning_signs": [
        {{ "sign": "string", "meaning": "string", "action": "string", "urgency": "string" }}
      ], // 5 items
      "monthly_checkups": [
        {{ "test": "string", "frequency": "string", "why": "string", "normal_range": "string" }}
      ] // 4 items
    }}
    
    All content must be specific to the {disease} (severity: {severity}), patient age, and gender.
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean response text
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        raise Exception(f"Health Advisor GenAI Error: {str(e)}")
