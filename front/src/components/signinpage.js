import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import '../App.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner
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
                navigate('/diagnosis');
            }
        } catch (error) {
            setMessage('Incorrect email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
                <h1>Sign in 😈</h1>
                <LoadingSpinner /> {/* Use LoadingSpinner here */}
                
                <div className="infield">
                    <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label></label>
                </div>
                <div className="infield">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label></label>
                </div>
                <button type="submit" className="forgot">DaemonSet입니다. 환영합니다.</button>
                <button type="submit">Sign In</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default SignInPage;