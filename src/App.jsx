import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminInvestments from './pages/Admin/AdminInvestments';
import AdminKYC from './pages/Admin/AdminKYC';
import Portfolio from './pages/Portfolio/Portfolio';
import KYC from './pages/KYC/KYC';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminDashboard />} />
            <Route path="/admin/sales" element={<AdminInvestments />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/admin/users" element={<AdminInvestments />} /> {/* Placeholder */}
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/kyc" element={<KYC />} />
          </Routes>

          {/* Global Components */}
          <AuthModal id="authModal" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
