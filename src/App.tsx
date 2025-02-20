import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import ChatApp from './pages/ChatApp';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import CareerCoachPage from './pages/CareerCoachPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ChatApp />} />
          <Route path="/app/career" element={<CareerCoachPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;