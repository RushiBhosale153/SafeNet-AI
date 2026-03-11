import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import Dashboard from './pages/Dashboard';
import PhishingScanner from './pages/PhishingScanner';
import WebsiteScanner from './pages/WebsiteScanner';
import LeakChecker from './pages/LeakChecker';
import AIAssistant from './pages/AIAssistant';
import HelpDesk from './pages/HelpDesk';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-cyber-black relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 cyber-grid animate-grid pointer-events-none"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-green/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <Navbar />
          <main className="flex-grow relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/phishing-scanner"
                element={
                  <PrivateRoute>
                    <PhishingScanner />
                  </PrivateRoute>
                }
              />
              <Route
                path="/website-scanner"
                element={
                  <PrivateRoute>
                    <WebsiteScanner />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leak-checker"
                element={
                  <PrivateRoute>
                    <LeakChecker />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ai-assistant"
                element={
                  <PrivateRoute>
                    <AIAssistant />
                  </PrivateRoute>
                }
              />
              <Route
                path="/help-desk"
                element={
                  <PrivateRoute>
                    <HelpDesk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;