import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // 올바르게 import
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
import AppointmentPage from './components/AppointmentPage';
import TokenExpiration from './components/TokenExpiration'; // 새로운 컴포넌트 추가

const getTokenExpiration = (token) => {
  const decodedToken = jwtDecode(token); // 올바른 함수 사용
  const expirationTime = decodedToken.exp * 1000; // 밀리초로 변환
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60); // 밀리초를 분으로 변환
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // 남은 초 계산
  return { minutes: remainingMinutes, seconds: remainingSeconds };
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setToken(token);

        try {
          const response = await axios.get('http://localhost:5012/protected', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUsername(response.data.logged_in_as.username);
          setIsAuthenticated(true);
        } catch (error) { 
          console.error('Error', error);
        }
      } else {
        console.log('no token');
      }
    };
    fetchUserEmail();
  }, [isAuthenticated]);

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
        {isAuthenticated && (
          <div className="user-info-wrapper">
            <div className="user-info">
              <p>안녕하세요, {username} 님</p>
            </div>
            {token && <TokenExpiration token={token} />}
          </div>
        )}
        <Routes>
          <Route path="/" element={<DefaultPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={isAuthenticated ? <Navigate to="/" /> : <SignInPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
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
