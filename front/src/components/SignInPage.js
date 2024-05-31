import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './SignInPage.css'; // SignInPage.css 파일을 임포트
import LoadingSpinner from './LoadingSpinner'; // LoadingSpinner를 import
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
                localStorage.setItem('token', response.data.access_token); // 토큰 저장
                navigate('/');
            }
        } catch (error) {
            console.error("로그인 중 에러 발생:", error); // 콘솔에 에러 로그 출력
            setMessage('로그인 중 에러가 발생했습니다.');
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
