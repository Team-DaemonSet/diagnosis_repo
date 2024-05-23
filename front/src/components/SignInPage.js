import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './SignInPage.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner

const SignInPage = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        // Here you can add authentication logic
<<<<<<< HEAD
        // For simplicity, we'll just set isAuthenticated to true ***
=======
        // For simplicity, we'll just set isAuthenticated to true
>>>>>>> 8ed60cb141b4e5ffc57b631179aa911b12c7384c
        setIsAuthenticated(true);
        navigate('/diagnosis');
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
                <button type="submit" className="forgot no-hover">DaemonSet입니다. 환영합니다.</button>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignInPage;
