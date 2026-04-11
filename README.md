# 🏥 HealthGuard AI

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini--AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

HealthGuard AI is a state-of-the-art disease prediction and health management platform. It combines machine learning models with the power of Google's Gemini AI to provide users with accurate disease risk assessments, automated medical report parsing, and comprehensive, personalized therapeutic health plans.

---

## 📌 Overview
HealthGuard AI bridge the gap between complex medical data and actionable patient health strategies. By analyzing symptoms, vital signs, and lab reports, the platform detects potential risks for common chronic conditions and generates immersive health guides containing nutrition, exercise, and lifestyle interventions.

## ✨ Features
- 🔬 **AI-Powered Diagnostics**: Multiple ML models trained on clinical datasets for high-accuracy disease detection.
- 📊 **Automated Report Reader**: Immersive medical report upload system that extracts clinical values using Google Gemini AI.
- 🧙 **5-Step Diagnostic Wizard**: A comprehensive intake flow collecting demographics, vitals, symptoms, and lab results.
- 🏋️ **Personalized Health Plans**: Automated generation of therapeutic guides, including:
    - **Nutrition & Food Guides**: Categorized "Eat" vs "Avoid" lists with healthy alternatives.
    - **Behavioral Habit Logs**: Daily DO's and DON'Ts with scientific justifications.
    - **Exercise Video Gallery**: Enriched workout tutorials via YouTube Search API.
- 📈 **Patient Analytics Dashboard**: Longitudinal tracking of health scores and risk distributions over time.
- 📥 **Clinical PDF Export**: Professional 4-page health passport generation for external consults.

---

## 🏗️ Architecture
```text
[ CLIENT ] <------> [ SERVER (NODE/EXPRESS) ] <------> [ AI ENGINE (FLASK/ML) ]
    |                    |                                |
    |-- React            |-- MongoDB (Atlas)              |-- Scikit-Learn (Symptom Models)
    |-- Tailwind CSS     |-- Socket.io (Real-time)        |-- Google Gemini Pro (LLM)
    |-- Recharts         |-- Multer (File Handling)       |-- Python Flask (AI API)
    |-- Framer Motion    |-- YouTube Data API             |-- PDF Parsing Engine
```

## 🛠️ Tech Stack
| Tier | Technology | Use Case |
| :--- | :--- | :--- |
| **Frontend** | React 18, Tailwind CSS | UI/UX & Responsive Layout |
| **State Management** | React Context API | Authentication & Patient State |
| **Visuals** | Recharts, Framer Motion | Charts & Animations |
| **Backend** | Node.js, Express.js | API Orchestration & Business Logic |
| **Database** | MongoDB Atlas | User Records & Health Histories |
| **AI/ML** | Python, Scikit-Learn | Disease Prediction Models |
| **LLM** | Google Gemini 1.5 Flash | Health Plan Generation & Extraction |
| **Content** | YouTube Data API v3 | Exercise Video Enrichment |

---

## 📁 Project Structure
```text
HEALTHGUARD-AI/
├── client/                 # React Frontend (Vite/CRA)
│   ├── public/             # Static Assets
│   └── src/
│       ├── components/     # Reusable UI Components
│       ├── context/        # Auth & Global State
│       ├── pages/          # Full Page Components
│       └── utils/          # API & PDF Helpers
├── server/                 # Node.js API
│   ├── config/             # DB & API Config
│   ├── middleware/         # Auth & Error Handlers
│   ├── models/             # Mongoose Schemas
│   └── routes/             # API Endpoints
└── ai-engine/              # Python AI Core
    ├── datasets/           # Clinical CSVs
    ├── models/             # Saved .pkl models
    └── predictor.py        # Flask API & Inference Logic
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- MongoDB Atlas Account
- Google AI Studio Account (Gemini API)
- Google Cloud Console Project (YouTube Data API)

### Installation
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Narasimma-22it35/DISEASE_PREDICTION.git
   cd DISEASE_PREDICTION
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

3. **Setup AI Engine**:
   ```bash
   cd ai-engine
   pip install -r requirements.txt
   # Create .env based on .env.example
   python predictor.py
   ```

4. **Setup Client**:
   ```bash
   cd client
   npm install
   npm start
   ```

### API Keys Required
- **GOOGLE_API_KEY**: Get it from [AI Studio](https://aistudio.google.dev/).
- **YOUTUBE_API_KEY**: Create a project in [Google Cloud Console](https://console.cloud.google.com/).
- **MONGO_URI**: Create a cluster in [MongoDB Atlas](https://www.mongodb.com/).

---

## 📊 ML Model Accuracy
The system utilizes optimized Random Forest and Gradient Boosting algorithms:
- **Diabetes Prediction**: 96.5% Accuracy
- **Heart Disease**: 94.2% Accuracy
- **General Symptom Model**: 95.8% Accuracy

---

## ⚠️ Disclaimer
**HealthGuard AI is not a medical device.** The assessments and plans generated by this platform are based on AI algorithms and medical datasets and should only be used as a preliminary guidance. **Always consult with a qualified medical professional for clinical diagnosis and treatment.**

## 👨‍💻 Team
Developed by **Narasimma** and the HealthGuard AI Team.
