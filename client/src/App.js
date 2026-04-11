import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Placeholder components for routes
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HealthGuard AI</h1>
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Your intelligent companion for disease prediction and personalized health management.</p>
    <div className="flex justify-center space-x-4">
      <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">Get Started</Link>
      <Link to="/login" className="bg-white text-gray-700 px-8 py-4 rounded-full font-bold shadow-sm border border-gray-100 hover:bg-gray-50 transition">Sign In</Link>
    </div>
  </div>
);

// We need Link for Home placeholder, but it will be better to just use standard placeholders
const Placeholder = ({ name }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-3xl font-bold text-gray-800">{name} Page</h2>
    <p className="text-gray-500 mt-2">Implementation coming soon...</p>
  </div>
);

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
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Placeholder name="Home" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Placeholder name="Dashboard" /></ProtectedRoute>} />
              <Route path="/predict" element={<ProtectedRoute><Placeholder name="New Prediction" /></ProtectedRoute>} />
              <Route path="/analyzing" element={<ProtectedRoute><Placeholder name="Analyzing" /></ProtectedRoute>} />
              <Route path="/result/:predictionId" element={<ProtectedRoute><Placeholder name="Prediction Result" /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
