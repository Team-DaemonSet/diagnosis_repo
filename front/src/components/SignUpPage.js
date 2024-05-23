import React, { useState } from 'react';
import '../App.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner
import axios from 'axios';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

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

            setMessage(response.data.msg);
        } catch (error) {
            setMessage('Error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                {<LoadingSpinner />}
                <span>or use your email for registration</span>
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
                    {isPasswordMatch && <span className="checkmark">✔️</span>}
                    <label></label>
                </div>
                <button type="submit">Sign Up</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};
export default SignUpPage;
