import os
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

app = Flask(__name__)
CORS(app) # Enable CORS for all origins

# Ensure uploads directory exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
        file.save(file_path)
        
        # Analyze report using Gemini
        analysis_result = read_medical_report(file_path)
        
        # Cleanup: Delete temp file
        os.remove(file_path)
        
        return jsonify(analysis_result), 200
    except Exception as e:
        import traceback
        print(f"ERROR IN /upload-report: {str(e)}")
        traceback.print_exc()
        # Cleanup on error if file exists
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
        # 1. Get Gemini Diagnosis
        diagnosis = detect_diseases(patient_data)
        
        # 2. Process Primary Disease with ML if available
        primary = diagnosis.get('primary_disease')
        if primary and primary.get('ml_model_available') and primary.get('ml_model_key') != 'none':
            model_key = primary.get('ml_model_key')
            
            # Run ML Prediction
            ml_result = run_ml_prediction(model_key, patient_data)
            
            if 'error' not in ml_result:
                # Combine Gemini risk and ML risk
                gemini_risk = primary.get('risk_percentage', 0)
                ml_risk = ml_result.get('risk_percentage', 0)
                
                final_risk = combine_predictions(gemini_risk, ml_risk)
                
                # Update diagnosis object
                primary['risk_percentage'] = final_risk
                primary['ml_result'] = ml_result
                primary['ml_applied'] = True
        
        # 3. Process Other Diseases with ML if available
        others = diagnosis.get('other_diseases', [])
        for disease in others:
            if disease.get('ml_model_available') and disease.get('ml_model_key') != 'none':
                m_key = disease.get('ml_model_key')
                ml_res = run_ml_prediction(m_key, patient_data)
                
                if 'error' not in ml_res:
                    g_risk = disease.get('risk_percentage', 0)
                    m_risk = ml_res.get('risk_percentage', 0)
                    disease['risk_percentage'] = combine_predictions(g_risk, m_risk)
                    disease['ml_applied'] = True

        return jsonify(diagnosis), 200
    except Exception as e:
        import traceback
        print("\n" + "!"*30)
        print(f"CRITICAL ERROR IN /detect-diseases: {str(e)}")
        traceback.print_exc()
        print("!"*30 + "\n")
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

    if not all([disease, risk_level, severity, patient_data]):
        return jsonify({"error": "Incomplete data for health plan generation"}), 400

    try:
        plan = generate_health_plan(disease, risk_level, severity, patient_data)
        return jsonify(plan), 200
    except Exception as e:
        import traceback
        print(f"ERROR IN /health-plan: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Listen on all interfaces for internal network access if needed
    app.run(host='0.0.0.0', port=5001, debug=True)
