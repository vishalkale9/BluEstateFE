import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AdminDashboard from './pages/Admin/AdminDashboard';
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
          </Routes>

          {/* Global Components */}
          <AuthModal id="authModal" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
