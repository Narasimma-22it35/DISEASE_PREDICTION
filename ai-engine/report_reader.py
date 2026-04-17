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
    content_parts = []

    if file_extension == '.pdf':
        try:
            with open(file_path, "rb") as pdf_file:
                content_parts.append({
                    "mime_type": "application/pdf",
                    "data": pdf_file.read()
                })
        except Exception as e:
            raise Exception(f"Failed to read PDF file: {str(e)}")
    elif file_extension in ['.jpg', '.jpeg', '.png']:
        try:
            mime = "image/png" if file_extension == '.png' else "image/jpeg"
            with open(file_path, "rb") as img_file:
                content_parts.append({
                    "mime_type": mime,
                    "data": img_file.read()
                })
        except Exception as e:
            raise Exception(f"Failed to open image: {str(e)}")
    elif file_extension == '.csv':
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                csv_schema_and_data = f.read()
                # Truncate to prevent LLM context flooding and timeouts on large datasets like heart.csv
                if len(csv_schema_and_data) > 3000:
                    csv_schema_and_data = csv_schema_and_data[:3000] + "\n...[TRUNCATED_DUE_TO_SIZE]"
                
                content_parts.append(f"CSV Data:\n{csv_schema_and_data}\n\nIMPORTANT INSTRUCTION: If this CSV contains multiple rows mapping to multiple patients, YOU MUST ONLY extract the biometric data for the VERY FIRST patient (first data row). Ignore everyone else.")
        except Exception as e:
            raise Exception(f"Failed to read CSV: {str(e)}")
    elif file_extension in ['.doc', '.docx']:
        try:
            import docx
            doc_file = docx.Document(file_path)
            doc_text = "\n".join([paragraph.text for paragraph in doc_file.paragraphs])
            # Truncate if maliciously large
            if len(doc_text) > 10000:
                doc_text = doc_text[:10000] + "\n...[TRUNCATED]"
            content_parts.append(f"Word Document Data:\n{doc_text}")
        except Exception as e:
            raise Exception(f"Failed to read Word Document: {str(e)}")
    else:
        raise Exception("Unsupported file format. Please upload a PDF, Image, CSV, or Word Document.")

    if not content_parts:
        raise Exception("No readable pages or content found in the report.")

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
        from retry_helper import generate_with_fallback
        # Prepare inputs for Gemini
        response = generate_with_fallback([prompt] + content_parts)
        
        # Use a more robust regex to find the JSON block in the response
        import re
        text = response.text.strip()
        print(f"[GEMINI] Raw response (first 200 chars): {text[:200]}...")
        
        if not text:
            print("[GEMINI] ERROR: Received empty response from model.")
            raise Exception("AI model returned an empty response.")

        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group(0)
            print("[GEMINI] JSON block extracted.")
        else:
            print("[GEMINI] WARNING: No JSON block found, attempting to parse raw text.")
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as je:
            print(f"[GEMINI] JSON PARSE ERROR: {str(je)}")
            print(f"[GEMINI] FAILED TEXT: {text}")
            raise Exception("Failed to parse AI response as JSON.")
    except Exception as e:
        print(f"[GEMINI] CRITICAL ERROR: {str(e)}")
        raise Exception(f"Gemini API Error: {str(e)}")
