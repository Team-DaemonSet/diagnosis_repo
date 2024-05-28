import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate  } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { jwtDecode } from 'jwt-decode';


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


const getTokenExpiration = (token) => {
  const decodedToken = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60); // Convert milliseconds to minutes
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // Get remaining seconds
  return { minutes: remainingMinutes, seconds: remainingSeconds };
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(''); 
  const [expiration, setExpiration] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
        const token = localStorage.getItem('token');
        if (token) {

            const remainingTime = getTokenExpiration(token);
            setExpiration(remainingTime);
            
            try {
                const response = await axios.get('http://localhost:5012/protected', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsername(response.data.logged_in_as.username);
            } catch (error) {
                console.error('Error', error);
                alert('Error');
            }
        } else {
            alert('No token found, please log in.');
        }
    };
    fetchUserEmail();

    // Update expiration time every second
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        const remainingTime = getTokenExpiration(token);
        setExpiration(remainingTime);
      }
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
}, []);


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
        <div className="user-info">
          {isAuthenticated && <p>안녕하세요, {username} 님😈</p>}
        </div>
        <div className="tokentime">
          {expiration && (<p>{expiration.minutes} : {expiration.seconds}</p>)}
        </div>
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
