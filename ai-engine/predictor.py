import joblib
import numpy as np
import shap
import os

# Load all models and scalers
MODELS = {}
SCALERS = {}
MODEL_KEYS = ['diabetes', 'heart', 'kidney', 'liver', 'hypertension']

for key in MODEL_KEYS:
    model_path = f'models/{key}_model.pkl'
    scaler_path = f'models/{key}_scaler.pkl'
    
    if os.path.exists(model_path):
        MODELS[key] = joblib.load(model_path)
    if os.path.exists(scaler_path):
        SCALERS[key] = joblib.load(scaler_path)

# FEATURE MAP defining exact order for each model
FEATURE_MAP = {
    'diabetes': ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'],
    'heart': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'],
    'kidney': ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc'],
    'liver': ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio'],
    'hypertension': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang']
}

def run_ml_prediction(model_key, patient_data):
    """
    Runs ML prediction with SHAP explainability.
    """
    if model_key not in MODELS or model_key not in SCALERS:
        return {"error": f"Model or Scaler for {model_key} not loaded."}

    model = MODELS[model_key]
    scaler = SCALERS[model_key]
    features = FEATURE_MAP[model_key]

    # Extract values in correct order
    input_values = []
    for f in features:
        val = patient_data.get(f, 0)
        # Handle cases where value might be None or empty string
        if val is None or val == "":
            val = 0
        input_values.append(val)

    # Scale input
    input_array = np.array([input_values])
    input_scaled = scaler.transform(input_array)

    # Get prediction probability
    risk_proba = model.predict_proba(input_scaled)[0][1]
    risk_percentage = round(float(risk_proba) * 100, 2)

    # SHAP Explainability
    try:
        # Logistic regression uses LinearExplainer, others use TreeExplainer
        if model_key == 'hypertension':
            explainer = shap.LinearExplainer(model, input_scaled)
        else:
            explainer = shap.TreeExplainer(model)
        
        shap_values = explainer.shap_values(input_scaled)
        
        # Handle different output formats of shap_values
        if isinstance(shap_values, list):
            # For multiclass or some versions, take the positive class values
            class_idx = 1
            vals = shap_values[class_idx][0]
        else:
            # For some explainers, it returns a 2D array
            vals = shap_values[0]

        # Map importances to feature names
        importances = []
        for i, val in enumerate(vals):
            importances.append({
                "feature": features[i],
                "importance": abs(float(val))
            })
        
        # Get top 3 factors
        top_factors = sorted(importances, key=lambda x: x['importance'], reverse=True)[:3]
    except Exception as e:
        print(f"SHAP Error: {e}")
        top_factors = []

    return {
        "risk_percentage": risk_percentage,
        "top_factors": top_factors
    }

def combine_predictions(gemini_risk, ml_risk):
    """
    Weighted ensemble of Gemini AI (40%) and ML model (60%)
    """
    combined = (gemini_risk * 0.4) + (ml_risk * 0.6)
    return round(combined, 2)
