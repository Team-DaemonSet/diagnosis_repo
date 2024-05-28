import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const HistoryPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchUserEmail = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5012/protected', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setEmail(response.data.logged_in_as.email);
                    setUsername(response.data.logged_in_as.username);
                    getRecords(response.data.logged_in_as.email);
                } catch (error) {
                    console.error('Error fetching user email', error);
                    alert('Error fetching user information');
                }
            } else {
                alert('No token found, please log in.');
            }
        };
        fetchUserEmail();
    }, []);

    const getRecords = async (userEmail) => {
        try {
            const token = localStorage.getItem('token');
            const historyresponse = await axios.get(`http://localhost:5007/records?email=${encodeURIComponent(userEmail)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setRecords(historyresponse.data);
        } catch (error) {
            console.error('Error fetching records:', error);
            alert('Error fetching records');
        }
    };

    return (
        <div>
            <h1>{username && `${username} 님의 진단기록`}</h1>
            <div id="records">
                {records.length === 0 ? (
                    <p>No records found</p>
                ) : (
                    <ul>
                        {records.map((record, index) => (
                            <li key={index}>
                                날짜: {record.diagnosis_date}
                                <br />
                                <img src={record.image_url} alt="User uploaded" style={{ width: '100px', height: '100px' }} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
