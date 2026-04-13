import pandas as pd
import numpy as np
import os

# Ensure the directory exists
os.makedirs('d:/Disease Prediction/ai-engine/datasets', exist_ok=True)

def gen_diabetes():
    data = {
        'Pregnancies': np.random.randint(0, 10, 100),
        'Glucose': np.random.randint(70, 200, 100),
        'BloodPressure': np.random.randint(60, 120, 100),
        'SkinThickness': np.random.randint(10, 50, 100),
        'Insulin': np.random.randint(0, 300, 100),
        'BMI': np.random.uniform(18, 45, 100),
        'DiabetesPedigreeFunction': np.random.uniform(0.1, 2.0, 100),
        'Age': np.random.randint(20, 80, 100),
        'Outcome': np.random.randint(0, 2, 100)
    }
    pd.DataFrame(data).to_csv('d:/Disease Prediction/ai-engine/datasets/diabetes.csv', index=False)

def gen_heart():
    data = {
        'age': np.random.randint(30, 80, 100),
        'sex': np.random.randint(0, 2, 100),
        'cp': np.random.randint(0, 4, 100),
        'trestbps': np.random.randint(90, 180, 100),
        'chol': np.random.randint(150, 400, 100),
        'fbs': np.random.randint(0, 2, 100),
        'restecg': np.random.randint(0, 3, 100),
        'thalach': np.random.randint(100, 200, 100),
        'exang': np.random.randint(0, 2, 100),
        'oldpeak': np.random.uniform(0, 4, 100),
        'slope': np.random.randint(0, 3, 100),
        'ca': np.random.randint(0, 4, 100),
        'thal': np.random.randint(0, 4, 100),
        'target': np.random.randint(0, 2, 100)
    }
    pd.DataFrame(data).to_csv('d:/Disease Prediction/ai-engine/datasets/heart.csv', index=False)

def gen_kidney():
    data = {
        'age': np.random.randint(10, 90, 100),
        'bp': np.random.randint(60, 120, 100),
        'sg': np.random.uniform(1.0, 1.05, 100),
        'al': np.random.randint(0, 5, 100),
        'su': np.random.randint(0, 5, 100),
        'bgr': np.random.randint(70, 300, 100),
        'bu': np.random.randint(10, 100, 100),
        'sc': np.random.uniform(0.5, 5, 100),
        'sod': np.random.randint(110, 160, 100),
        'pot': np.random.uniform(2, 6, 100),
        'hemo': np.random.uniform(8, 18, 100),
        'pcv': np.random.randint(20, 55, 100),
        'wc': np.random.randint(4000, 12000, 100),
        'rc': np.random.uniform(2, 7, 100),
        'classification': np.random.choice(['ckd', 'notckd'], 100)
    }
    pd.DataFrame(data).to_csv('d:/Disease Prediction/ai-engine/datasets/kidney_disease.csv', index=False)

def gen_liver():
    data = {
        'Age': np.random.randint(10, 80, 100),
        'Gender': np.random.choice([1, 0], 100), # Using numeric directly
        'Total_Bilirubin': np.random.uniform(0.1, 10, 100),
        'Direct_Bilirubin': np.random.uniform(0.1, 5, 100),
        'Alkaline_Phosphotase': np.random.randint(100, 1000, 100),
        'Alamine_Aminotransferase': np.random.randint(10, 500, 100),
        'Aspartate_Aminotransferase': np.random.randint(10, 500, 100),
        'Total_Protiens': np.random.uniform(4, 9, 100),
        'Albumin': np.random.uniform(2, 5, 100),
        'Albumin_and_Globulin_Ratio': np.random.uniform(0.3, 2, 100),
        'Dataset': np.random.choice([1, 2], 100)
    }
    pd.DataFrame(data).to_csv('d:/Disease Prediction/ai-engine/datasets/liver_disease.csv', index=False)

def gen_hypertension():
    data = {
        'age': np.random.randint(20, 90, 100),
        'sex': np.random.randint(0, 2, 100),
        'cp': np.random.randint(0, 4, 100),
        'trestbps': np.random.randint(90, 200, 100),
        'chol': np.random.randint(120, 400, 100),
        'fbs': np.random.randint(0, 2, 100),
        'restecg': np.random.randint(0, 3, 100),
        'thalach': np.random.randint(80, 200, 100),
        'exang': np.random.randint(0, 2, 100),
        'target': np.random.randint(0, 2, 100)
    }
    pd.DataFrame(data).to_csv('d:/Disease Prediction/ai-engine/datasets/hypertension.csv', index=False)

if __name__ == "__main__":
    gen_diabetes()
    gen_heart()
    gen_kidney()
    gen_liver()
    gen_hypertension()
    print("Mock datasets generated successfully in d:/Disease Prediction/ai-engine/datasets/")
