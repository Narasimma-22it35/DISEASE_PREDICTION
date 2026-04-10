import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

def train_diabetes():
    print("\n" + "="*30)
    print("Training DIABETES model...")
    try:
        df = pd.read_csv('datasets/diabetes.csv')
        
        # Handle missing values
        df.fillna(df.median(), inplace=True)
        
        X = df[['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']]
        y = df['Outcome']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        preds = model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        print(classification_report(y_test, preds))
        
        joblib.dump(model, 'models/diabetes_model.pkl')
        joblib.dump(scaler, 'models/diabetes_scaler.pkl')
        print("Diabetes model and scaler saved.")
    except Exception as e:
        print(f"Error training Diabetes: {e}")

def train_heart():
    print("\n" + "="*30)
    print("Training HEART DISEASE model...")
    try:
        df = pd.read_csv('datasets/heart.csv')
        df.fillna(df.median(), inplace=True)
        
        X = df[['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']]
        y = df['target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        preds = model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        
        joblib.dump(model, 'models/heart_model.pkl')
        joblib.dump(scaler, 'models/heart_scaler.pkl')
        print("Heart model and scaler saved.")
    except Exception as e:
        print(f"Error training Heart: {e}")

def train_kidney():
    print("\n" + "="*30)
    print("Training KIDNEY DISEASE model...")
    try:
        df = pd.read_csv('datasets/kidney_disease.csv')
        df.replace('?', np.nan, inplace=True)
        df.dropna(inplace=True)
        
        # Mapping target
        df['classification'] = df['classification'].apply(lambda x: 1 if 'ckd' in str(x) else 0)
        
        # Specify features (assuming names match dataset)
        features = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc']
        # Convert necessary columns to numeric
        for col in features:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        df.dropna(subset=features, inplace=True)
        
        X = df[features]
        y = df['classification']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        preds = model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        
        joblib.dump(model, 'models/kidney_model.pkl')
        joblib.dump(scaler, 'models/kidney_scaler.pkl')
        print("Kidney model and scaler saved.")
    except Exception as e:
        print(f"Error training Kidney: {e}")

def train_liver():
    print("\n" + "="*30)
    print("Training LIVER DISEASE model...")
    try:
        df = pd.read_csv('datasets/liver_disease.csv')
        df.fillna(df.median(), inplace=True)
        
        # Encode Gender
        df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
        
        # Target convert: 1->1, 2->0
        df['Dataset'] = df['Dataset'].map({1: 1, 2: 0})
        
        features = ['Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin', 'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 'Aspartate_Aminotransferase', 'Total_Protiens', 'Albumin', 'Albumin_and_Globulin_Ratio']
        X = df[features]
        y = df['Dataset']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        preds = model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        
        joblib.dump(model, 'models/liver_model.pkl')
        joblib.dump(scaler, 'models/liver_scaler.pkl')
        print("Liver model and scaler saved.")
    except Exception as e:
        print(f"Error training Liver: {e}")

def train_hypertension():
    print("\n" + "="*30)
    print("Training HYPERTENSION model...")
    try:
        df = pd.read_csv('datasets/hypertension.csv')
        df.fillna(df.median(), inplace=True)
        
        X = df[['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang']]
        y = df['target']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        model = LogisticRegression(max_iter=1000, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        preds = model.predict(X_test_scaled)
        print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")
        
        joblib.dump(model, 'models/hypertension_model.pkl')
        joblib.dump(scaler, 'models/hypertension_scaler.pkl')
        print("Hypertension model and scaler saved.")
    except Exception as e:
        print(f"Error training Hypertension: {e}")

if __name__ == "__main__":
    train_diabetes()
    train_heart()
    train_kidney()
    train_liver()
    train_hypertension()
    print("\n" + "="*30)
    print("All models trained successfully!")
    print("Models saved in models/ folder")
