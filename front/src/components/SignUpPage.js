import React, { useState } from 'react';
import '../App.css';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner


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
                <h1>Create Account 😈</h1>
                <LoadingSpinner /> {/* Use LoadingSpinner here */}
                
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



export default SignUpPage; 

