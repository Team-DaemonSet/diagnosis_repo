import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinneraa
import axios from 'axios';

const SignInPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    
    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5012/signin', {
                email: email,
                password: password
            }, {
                headers: {'Content-Type': 'application/json'}
            });

            setMessage(response.data.msg);
            if (response.status === 200) {
                setIsAuthenticated(true);
                localStorage.setItem('token', response.data.access_token); // Save the token
                navigate('/');
            }
        } catch (error) {
            console.error("Error during sign in:", error); // Log error to console
            setMessage('An error occurred during sign in.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
                <h1 className="centered">Diagnosis</h1>
                <hr className="divider" />
                <h2 className="centered">Sign in</h2>
                <p className="centered">회원가입 하신 이메일 주소를 입력해 주세요.</p>
                <div className="infield">
                    <input type="email" placeholder="email@daemonset.com" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="infield">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="sign-in-button">Sign In</button> {/* 클래스 추가 */}
                <button type="button" className="sign-up-button" onClick={handleSignUp}>Sign Up</button>
        
                <div className="social-login">
                    <button className="social-btn google"></button>
                    <button className="social-btn kakao"></button>
                    <button className="social-btn naver"></button>
                </div>
                {message && <p>{message}</p>}
            </form>
            {isLoading && <LoadingSpinner />} {/* 로딩 중일 때 LoadingSpinner 표시 */}
        </div>
    );
};

export default SignInPage;