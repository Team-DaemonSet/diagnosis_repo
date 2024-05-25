import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const AuthButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>Sign Out</button>
    );
};

const DefaultPage = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        setIsAuthenticated(false);
        navigate('/signin');
    };

    const lc = () => {
        localStorage.clear();
    };

    return (
        <div className="default-page">
            <div className='link'>
                <Link to="/diagnosis">Diagnosis</Link>
                {isAuthenticated ? (
                    <>
                        <AuthButton onClick={handleSignOut} />
                    </>
                ) : (
                    <>
                        <Link to="/signin">로그인 (Sign In)</Link>
                    </>
                )}
            </div>
            <h1>기본 페이지입니다.<hr></hr>기본 페이지라고 말했습니다.</h1>
        </div>
    );
};

export default DefaultPage;
