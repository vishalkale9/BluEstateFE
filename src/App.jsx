import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminInvestments from './pages/Admin/AdminInvestments';
import AdminKYC from './pages/Admin/AdminKYC';
import AdminUsers from './pages/Admin/AdminUsers';
import Portfolio from './pages/Portfolio/Portfolio';
import TransactionHistory from './pages/Portfolio/TransactionHistory';
import Explore from './pages/Explore/Explore';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails';
import SecondaryMarket from './pages/Secondary/SecondaryMarket';
import KYC from './pages/KYC/KYC';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/secondary-market" element={<SecondaryMarket />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AdminDashboard />} />
            <Route path="/admin/sales" element={<AdminInvestments />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/history" element={<TransactionHistory />} />
            <Route path="/kyc" element={<KYC />} />
          </Routes>

          {/* Global Components */}
          <AuthModal id="authModal" />
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
