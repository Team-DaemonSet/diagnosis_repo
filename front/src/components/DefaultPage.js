import React from 'react';
import { Link } from 'react-router-dom';
import './DefaultPage.css';

const DefaultPage = () => (
    <div className="default-page">
        <div className="content">
            <h1>Daemonset Diagnosis</h1>
            <p>비대면 피부질환 AI 진단 서비스</p>
            <div className="buttons">
                <Link to="/diagnosis" className="btn btn-diagnosis">
                    <span>바로<br/>진단</span>
                    <i className="icon-stethoscope"></i>
                </Link>
                <Link to="/records" className="btn btn-records">
                    <span>진단<br/>기록</span>
                    <i className="icon-clipboard"></i>
                </Link>
                <Link to="/appointment" className="btn btn-appointment">
                    <span>병원<br/>예약</span>
                    <i className="icon-calendar"></i>
                </Link>
            </div>
            <Link to="/signin" className="btn btn-login">Log In</Link>
        </div>
    </div>
);

export default DefaultPage;