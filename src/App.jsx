import React from 'react';
import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Home />
        {/* Global Auth Modal */}
        <AuthModal id="authModal" />
      </div>
    </AuthProvider>
  );
}

export default App;
