import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientInput from './pages/PatientInput';
import ReportUpload from './pages/ReportUpload';
import SymptomForm from './pages/SymptomForm';
import Analyzing from './pages/Analyzing';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '16px',
                background: '#333',
                color: '#fff',
                fontWeight: 'bold'
              },
            }}
          />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/predict" element={<ProtectedRoute><PatientInput /></ProtectedRoute>} />
              <Route path="/predict/upload" element={<ProtectedRoute><ReportUpload /></ProtectedRoute>} />
              <Route path="/predict/form" element={<ProtectedRoute><SymptomForm /></ProtectedRoute>} />
              <Route path="/analyzing" element={<ProtectedRoute><Analyzing /></ProtectedRoute>} />
              <Route path="/result/:predictionId" element={<ProtectedRoute><Result /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm font-medium">© 2026 HealthGuard AI. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
