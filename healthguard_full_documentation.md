# 🏥 HealthGuard AI — Comprehensive Project Document & Interview Guide

> **"Bridging the gap between complex medical data and accessible patient care through Hybrid AI/ML."**

---

## 🌟 1. Project Motivation: Why HealthGuard AI?

Traditional medical reports are often filled with technical jargon that is difficult for patients to understand. This gap can lead to delayed treatment or unnecessary anxiety. 

**I chose to build HealthGuard AI because:**
- **Accessibility**: Millions of people struggle with medical literacy. Our **Voice Assistant** and **Direct Maps integration** make diagnosis understandable even for low-literacy users.
- **Early Detection**: By combining **Machine Learning (ML)** for statistical risk with **Generative AI (LLM)** for clinical reasoning, we provide a "second opinion" that helps detect risks early.
- **Bridging Diagnostic Gaps**: Most medical platforms stop at diagnosis. HealthGuard AI continues the journey by offering actionable health plans and connecting patients to physical hospitals.

---

## 🛠️ 2. The Modern Tech Stack (The "Hybrid" Architecture)

This project uses a **Microservices Architecture** to leverage the best of three worlds:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js 18** | High-performance, components-based UI with **Tailwind CSS** for premium styling and **Framer Motion** for smooth animations. |
| **Backend** | **Node.js + Express** | Orchestrates business logic, manages **JWT Authentication**, and handles file uploads via **Multer**. |
| **AI Engine** | **Python (Flask)** | The "Brain." Runs **scikit-learn** ML models and integrates **Google Gemini Pro** for NLP parsing. |
| **Database** | **MongoDB Atlas** | A NoSQL cloud database chosen for its flexible schema to store diverse patient metrics. |
| **Intelligence**| **Hybrid AI/ML** | An ensemble of 5 specific ML models (Random Forest, etc.) + Gemini 2.0 LLM for reasoning. |

---

## 🚀 3. Key Features & Implementation

### 🅰️ Intelligent Report Reading
- **The Problem**: Manual entry is prone to error.
- **The Solution**: Uses **Google Gemini AI** to "look" at uploaded CSVs, PDFs, or Images and extract biometric data (Blood Sugar, Pressure, etc.) automatically.
- **Tech**: `google-generativeai` + custom normalization logic.

### 🅱️ Ensemble ML Diagnosis
- **The Solution**: We don't just "guess." We run patient data through **5 specialized models**:
  - **Diabetes/Kidney/Heart**: Random Forest / Gradient Boosting.
  - **Hypertension**: Logistic Regression.
- **Robustness**: I implemented an "Error-Safe" predictor that handles imperfectly trained models without crashing the application.

### 🎙️ Inclusive Voice Assistant
- **The Solution**: A dark-themed audio panel that reads the full diagnosis, including Do's and Don'ts, using the **Web Speech API**.
- **Impact**: Crucial for visually impaired patients or those who cannot read complex text.

### 🏥 "Consult Now" — Real-world Integration
- **The Solution**: Uses the browser **Geolocation API** and **OpenStreetMap** to find a patient's city, then generates directed **Google Maps** searches for specialists (Cardiologists, etc.) and hospitals.

### 🎥 Automated Exercise Engine
- **The Problem**: Expensive API keys often break YouTube integrations.
- **The Solution**: I built a **Fallback Engine** that generates smart search URLs (e.g., `youtube.com/results?search_query=yoga+for+diabetes`) ensuring patients ALWAYS have access to videos.

---

## 💻 4. How to Run the Project (Developer Guide)

You need to run **three separate terminals** for the three services:

### 1️⃣ Python AI Engine (Port 5001)
```powershell
# Navigate to the ai-engine folder
cd ai-engine
# Use your virtual environment python
.venv\Scripts\python.exe app.py
```

### 2️⃣ Node.js Backend Server (Port 5000)
```powershell
# Navigate to the server folder
cd server
# Run with nodemon for auto-restart
npm run dev
```

### 3️⃣ React Frontend (Port 3000)
```powershell
# Navigate to the client folder
cd client
# Start the development server
npm start
```

---

## 📦 5. Important Libraries & Dependencies

### **AI Engine (Python)**
- `pandas` & `numpy`: For handling medical datasets.
- `scikit-learn`: For the Random Forest and Gradient Boosting algorithms.
- `flask` & `flask-cors`: For creating the AI microservice.
- `google-generativeai`: For the Gemini LLM integration.
- `joblib`: For saving and loading trained `.pkl` models.
- `shap`: Used for AI Explainability (explaining *why* a risk is high).

### **Backend (Node.js)**
- `mongoose`: To communicate with MongoDB.
- `jsonwebtoken (JWT)`: For secure user logins.
- `bcryptjs`: For hashing passwords.
- `multer`: For handling report file uploads.
- `axios`: For communicating with the Python AI Engine.

### **Frontend (React)**
- `framer-motion`: For premium UI transitions.
- `recharts`: For interactive risk factor bar charts.
- `react-icons (Hi, Md)`: For the professional medical iconography.
- `jspdf`: For generating the downloadable medical PDF report.

---


