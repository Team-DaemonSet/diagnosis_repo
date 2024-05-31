import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './SignUpPage.css';
import LoadingSpinner from './LoadingSpinner'; // LoadingSpinner를 import
import axios from 'axios';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate(); // useNavigate 초기화

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setIsPasswordMatch(e.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setIsPasswordMatch(password === e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isPasswordMatch) {
            setMessage("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5011/signup', {
                username: username,
                email: email,
                password: password,
                re_password: confirmPassword
            });
            if (response.status === 200) {
                setMessage(response.data.msg);
                navigate('/signin');        
            }
        } catch (error) {
            setMessage('Error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleSubmit}>
                <h1>회원가입</h1>
                {<LoadingSpinner />}
                <span className="description-text">회원가입을 위한 <br /> 이름, 이메일, 비밀번호를 설정해 주세요.</span>
                <div className="infield">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label></label>
                </div>
                <div className="infield">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                    {!isPasswordMatch && <span className="error">  X</span>}
                    {isPasswordMatch && <span className="checkmark">✔️</span>}
                    <label></label>
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default SignUpPage;
