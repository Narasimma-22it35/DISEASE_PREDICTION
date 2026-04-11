import os
import json
import base64
import google.generativeai as genai
from PIL import Image
from pdf2image import convert_from_path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

def read_medical_report(file_path: str):
    """
    Reads medical report from image or PDF using Gemini 1.5 Flash.
    """
    file_extension = os.path.splitext(file_path)[1].lower()
    images = []

    if file_extension == '.pdf':
        # Convert first 3 pages of PDF to images
        try:
            pages = convert_from_path(file_path, first_page=1, last_page=3)
            for page in pages:
                images.append(page)
        except Exception as e:
            raise Exception(f"Failed to convert PDF: {str(e)}")
    elif file_extension in ['.jpg', '.jpeg', '.png']:
        try:
            images.append(Image.open(file_path))
        except Exception as e:
            raise Exception(f"Failed to open image: {str(e)}")
    else:
        raise Exception("Unsupported file format. Please upload a PDF or Image.")

    if not images:
        raise Exception("No readable pages found in the report.")

    prompt = """
    You are a medical report analyzer. 
    Extract ALL clinical and biometric values from this report.
    Return ONLY valid JSON with no extra text or code fences:
    {
      "patient_name": "string or null",
      "age": number or null,
      "gender": "string or null",
      "report_date": "string or null",
      "report_type": "string",
      "extracted_values": {
        "blood_glucose_fasting": number or null,
        "blood_glucose_pp": number or null,
        "hba1c": number or null,
        "blood_pressure_systolic": number or null,
        "blood_pressure_diastolic": number or null,
        "total_cholesterol": number or null,
        "hdl_cholesterol": number or null,
        "ldl_cholesterol": number or null,
        "triglycerides": number or null,
        "hemoglobin": number or null,
        "wbc_count": number or null,
        "rbc_count": number or null,
        "platelet_count": number or null,
        "creatinine": number or null,
        "urea": number or null,
        "uric_acid": number or null,
        "sgot": number or null,
        "sgpt": number or null,
        "bilirubin_total": number or null,
        "tsh": number or null,
        "t3": number or null,
        "t4": number or null,
        "bmi": number or null,
        "spo2": number or null
      },
      "detected_abnormalities": ["string"],
      "normal_ranges_reference": {},
      "doctor_notes": "string or null"
    }
    """

    try:
        # Prepare inputs for Gemini
        response = model.generate_content([prompt] + images)
        
        # Clean response text (remove json fences if present)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
        
        return json.loads(text.strip())
    except Exception as e:
        raise Exception(f"Gemini API Error: {str(e)}")
