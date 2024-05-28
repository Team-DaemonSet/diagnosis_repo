import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DefaultPage.css';

const AuthButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>Sign Out</button>
    );
};

const DefaultPage = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/signin');
    };

    return (
        <div className="default-page">
            <div className='content'>
                <h1>DaemonSet Diagnosis</h1>
                <p>비대면 피부질환 AI 진단 서비스</p>
                <div className='buttons'>
                    <Link to="/diagnosis" className='btn btn-diagnosis'>
                        <span>바로<br/>진단</span>
                        <i className="icon-stethoscope"></i>
                    </Link>
                    <Link to="/history" className="btn btn-records">
                        <span>진단<br/>기록</span>
                        <i className="icon-clipboard"></i>
                    </Link>
                    <Link to="/appointment" className="btn btn-appointment">
                        <span>병원<br/>예약</span>
                        <i className="icon-calendar"></i>
                    </Link>
                {isAuthenticated ? (
                    <>
                        <AuthButton onClick={handleSignOut} />
                    </>
                ) : (
                    <>
                        <Link to="/signin" className='btn btn-login'>로그인</Link>
                    </>
                )}
                </div>
            </div>
        </div>
    );
};

export default DefaultPage;
