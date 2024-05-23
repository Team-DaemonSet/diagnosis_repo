import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
<<<<<<< HEAD
import './components/DefaultPage.css';
import './components/SignInPage.css';
import './components/SignUpPage.css';
import './components/DiagnosisPage.css';
=======
>>>>>>> 8ed60cb141b4e5ffc57b631179aa911b12c7384c
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
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
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
