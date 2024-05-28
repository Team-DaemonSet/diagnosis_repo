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

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSignIn}>
                <h1>Sign in 😈</h1>
                <LoadingSpinner /> {/* Use LoadingSpinner here */}
                
                <div className="infield">
                    <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <label></label>
                </div>
                <div className="infield">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <label></label>
                </div>
                <button type="submit">Sign In</button>
                {message && <p>{message}</p>}
                <div className='SU_button'><Link to="/signup">Sign Up</Link></div>
            </form>
        </div>
    );
};

export default SignInPage;