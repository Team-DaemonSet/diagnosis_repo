import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate  } from 'react-router-dom';
import './App.css';

import './components/DefaultPage.css';
import './components/SignInPage.css';
import './components/SignUpPage.css';
import './components/DiagnosisPage.css';
import DefaultPage from './components/DefaultPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import DiagnosisPage from './components/DiagnosisPage';
import HistoryPage from './components/HistoryPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
      }
    }, [isAuthenticated]);

    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div className="container">
        <div className="header">
          <Link to="/" className="daemonset-logo">DaemonSet</Link>
        </div>
        <Routes>
        <Route path="/" element={<DefaultPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/" /> : <SignInPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/diagnosis"
            element={
              <ProtectedRoute>
                <DiagnosisPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
