import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Import our custom modules
from report_reader import read_medical_report
from disease_detector import detect_diseases
from health_advisor import generate_health_plan
from predictor import run_ml_prediction, combine_predictions

# Load env vars
load_dotenv()

# Force unbuffered output for real-time terminal logging
os.environ['PYTHONUNBUFFERED'] = '1'

app = Flask(__name__)
CORS(app) # Enable CORS for all origins

# Ensure uploads directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def log_ai(msg, level="INFO"):
    """Custom logger to ensure terminal output is shown immediately."""
    prefix = "🚀 [AI ENGINE]" if level == "INFO" else "⚠️ [AI ERROR]"
    print(f"{prefix} {msg}", flush=True)

# Startup confirmation
print("\n" + "="*50)
log_ai("HealthGuard AI Engine is initializing...")
log_ai(f"Gemini API Status: {'Connected' if os.getenv('GEMINI_API_KEY') else 'DISCONNECTED (Check .env)'}")
log_ai("Server listening on http://localhost:5001")
print("="*50 + "\n", flush=True)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check route to verify service status."""
    return jsonify({
        "status": "ok",
        "service": "HealthGuard AI Engine",
        "genai_connected": os.getenv("GEMINI_API_KEY") is not None
    }), 200

@app.route('/upload-report', methods=['POST'])
def upload_report():
    """Route to handle medical report uploads and analysis."""
    if 'report' not in request.files:
        return jsonify({"error": "No report file provided"}), 400
    
    file = request.files['report']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        log_ai(f"Incoming medical report upload: {file.filename}")
        file.save(file_path)
        
        log_ai("Parsing report with Gemini Vision...")
        analysis_result = read_medical_report(file_path)
        log_ai("Report analysis SUCCESSFUL!")
        
        # Cleanup: Delete temp file
        os.remove(file_path)
        
        return jsonify(analysis_result), 200
    except Exception as e:
        log_ai(f"Error in /upload-report: {str(e)}", level="ERROR")
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

@app.route('/detect-diseases', methods=['POST'])
def detect():
    """Route to perform disease detection with Gemini and ML Ensemble."""
    patient_data = request.json
    if not patient_data:
        return jsonify({"error": "Missing patient data"}), 400

    try:
        log_ai(f"Starting disease detection for patient...")
        
        # 1. Get Gemini Diagnosis
        diagnosis = detect_diseases(patient_data)
        log_ai(f"Primary Diagnosis Found: {diagnosis.get('primary_disease', {}).get('name')}")
        
        # 2. Process Primary Disease with ML if available
        primary = diagnosis.get('primary_disease')
        if primary and primary.get('ml_model_available') and primary.get('ml_model_key') != 'none':
            model_key = primary.get('ml_model_key')
            log_ai(f"ML Processing requested for: {model_key}")
            
            ml_result = run_ml_prediction(model_key, patient_data)
            
            if 'error' not in ml_result:
                gemini_risk = primary.get('risk_percentage', 0)
                ml_risk = ml_result.get('risk_percentage', 0)
                final_risk = combine_predictions(gemini_risk, ml_risk)
                
                primary['risk_percentage'] = final_risk
                primary['ml_result'] = ml_result
                primary['ml_applied'] = True
                log_ai(f"ML Analysis combined. Final Risk: {final_risk}%")
        
        return jsonify(diagnosis), 200
    except Exception as e:
        log_ai(f"Critical error in /detect-diseases: {str(e)}", level="ERROR")
        return jsonify({"error": str(e)}), 500

@app.route('/health-plan', methods=['POST'])
def health_plan():
    """Route to generate a complete health plan."""
    data = request.json
    if not data:
        return jsonify({"error": "Missing data"}), 400

    disease = data.get('disease')
    risk_level = data.get('risk_level')
    severity = data.get('severity')
    patient_data = data.get('patient_data')

    try:
        log_ai(f"Generating personalized health plan for {disease}...")
        plan = generate_health_plan(disease, risk_level, severity, patient_data)
        log_ai("Health plan generation COMPLETE!")
        return jsonify(plan), 200
    except Exception as e:
        log_ai(f"Error in /health-plan: {str(e)}", level="ERROR")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Global error handler for the AI Engine."""
    log_ai(f"UNHANDLED EXCEPTION: {str(e)}", level="ERROR")
    import traceback
    traceback.print_exc()
    return jsonify({"error": "Internal AI Engine Error", "details": str(e)}), 500

if __name__ == '__main__':
    # threaded=True is vital for ensuring the server stays responsive during long AI tasks
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
