import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import SignInPage from './components/signinpage'
import SignUpPage from './components/signuppage'
import DiagnosisPage from './components/diagnosepage';



const DefaultPage = () => (
  <div className="default-page">
    <h1>기본 페이지입니다.<hr></hr>기본 페이지라고 말했습니다.</h1>
  </div>
);

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
          <Route path="/diagnosis" element={isAuthenticated ? <DiagnosisPage /> : <DefaultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



