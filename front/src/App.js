import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

import './components/DefaultPage.css';
import './components/SignInPage.css';
import './components/SignUpPage.css';
import './components/DiagnosisPage.css';
import DefaultPage from './components/DefaultPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import DiagnosisPage from './components/DiagnosisPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="container">
        <div className="header">
          <Link to="/" className="daemonset-logo">DaemonSet</Link>
        </div>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/diagnosis">Diagnosis</Link>
              <button onClick={() => setIsAuthenticated(false)}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
        <Routes>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/signin" element={<SignInPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/diagnosis" element={isAuthenticated ? <DiagnosisPage /> : <SignInPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
