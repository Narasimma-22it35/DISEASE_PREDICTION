# HealthGuard AI
### AI-Powered Universal Disease Prediction & Personal Health Companion

![MERN](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Script-Python-yellow?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_AI-orange?style=for-the-badge)
![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey?style=for-the-badge)

## Overview
HealthGuard AI is a cutting-edge, comprehensive health management system that leverages Advanced Machine Learning and Generative AI to provide accurate disease predictions, personalized health insights, and proactive wellness monitoring. By integrating a robust MERN stack with a specialized Python-based AI engine, it offers a seamless experience for both users and healthcare providers.

## Features
- **Multi-Disease Prediction**: Predict various ailments based on symptoms and clinical data.
- **AI Health Companion**: Personalized health advice powered by Google Gemini AI.
- **Interactive Dashboards**: Visualize health trends and predictions with Recharts.
- **Medical Report Analysis**: Upload and parse medical reports (PDF/Images) using AI.
- **Real-time Notifications**: Instant alerts via Socket.io.
- **Emergency Assistance**: Quick access to health resources and nearby facilities.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **AI Engine**: Python, Flask, Scikit-learn, Google Gemini AI (Generative AI)
- **Real-time**: Socket.io
- **Storage**: Multer for file uploads (Medical reports, Profiles)

## Module Structure
```text
├── client/           # React frontend
├── server/           # Node.js backend
├── ai-engine/        # Python Flask AI engine
└── datasets/         # Training datasets for ML models
```

## API Keys Required
To run this project, you will need the following API keys:
- `GEMINI_API_KEY`: For Generative AI capabilities.
- `SERPER_API_KEY`: For search capabilities.
- `YOUTUBE_API_KEY`: For health recommendation videos.
- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key for authentication.

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.8+
- MongoDB Account

### Root
1. Clone the repository.
2. Install dependencies in each module.

### Backend (Server)
```bash
cd server
npm install
npm start
```

### AI Engine
```bash
cd ai-engine
pip install -r requirements.txt
python app.py
```

### Frontend (Client)
```bash
cd client
npm install
npm start
```

## How to Run
1. Ensure MongoDB is running and `.env` files are configured.
2. Start the AI Engine (Flask) on port 5001.
3. Start the Server (Node) on port 5000.
4. Start the Client (React) on port 3000.

## Screenshots
*(Coming Soon: High-resolution screenshots of the dashboard and prediction models)*

## Disclaimer
HealthGuard AI is an AI-powered tool designed for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
