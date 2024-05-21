import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import LoadingSpinner from './components/LoadingSpinner'; // Import the LoadingSpinner




const DefaultPage = () => (
  <div className="default-page">
    <h1>기본 페이지입니다.<hr></hr>기본 페이지라고 말했습니다.</h1>
  </div>
);

const SignUpPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsPasswordMatch(password === e.target.value);
  };

  return (
    <div className="form-container sign-up-container">
      <form>
        <h1>Create Account</h1>
        <LoadingSpinner /> {/* Use LoadingSpinner here */}
        <span>or use your email for registration</span>
        <div className="infield">
          <input type="text" placeholder="Name" />
          <label></label>
        </div>
        <div className="infield">
          <input type="email" placeholder="Email" name="email" />
          <label></label>
        </div>
        <div className="infield">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <label></label>
        </div>
        <div className="infield">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {isPasswordMatch && <span className="checkmark">✔️</span>}
          <label></label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};



const SignInPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Here you can add authentication logic
    // For simplicity, we'll just set isAuthenticated to true
    setIsAuthenticated(true);
    navigate('/diagnosis');
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSignIn}>
        <h1>Sign in</h1>
        <LoadingSpinner /> {/* Use LoadingSpinner here */}
        <span>or use your account</span>
        <div className="infield">
          <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label></label>
        </div>
        <div className="infield">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label></label>
        </div>
        <button type="submit" className="forgot">Forgot your password?</button>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

const DiagnosisPage = () => {
  const [file, setFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [result, setResult] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // 진단 결과와 클래스 확률을 별도로 저장
      setDiagnosis(response.data.Diagnosis);
      const { Diagnosis, ...classProbs } = response.data;  // Diagnosis를 제외한 나머지 데이터
      setResult(JSON.stringify(classProbs, null, 2)); // JSON 문자열로 변환
    } catch (error) {
      console.error('Upload error', error);
      alert('업로드 실패!');
    }
  };

  return (
    <div>
      <h1>이미지 업로드 및 진단</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>진단</button>
      <div>
        <h3>Results:</h3>
        <p>{diagnosis}</p>  
        <pre>{result}</pre>  
      </div>
    </div>
  );
};

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

