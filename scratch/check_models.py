import joblib
import os

MODEL_KEYS = ['diabetes', 'heart', 'kidney', 'liver', 'hypertension']

for key in MODEL_KEYS:
    model_path = f'models/{key}_model.pkl'
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"Model: {key}")
        try:
            print(f"  Classes: {model.classes_}")
        except:
            print(f"  Classes: (Could not determine)")
    else:
        print(f"Model: {key} (NOT FOUND)")
