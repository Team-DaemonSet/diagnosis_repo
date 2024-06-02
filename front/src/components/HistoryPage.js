import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const HistoryPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [records, setRecords] = useState([]);
    const [expandedItem, setExpandedItem] = useState(null);

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

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleItemClick = (index) => {
        if (expandedItem === index) {
            setExpandedItem(null);
        } else {
            setExpandedItem(index);
        }
    };

    return (
        <div>
            <h1>{username && `${username} 님의 진단기록`}</h1>
            <div id="records">
                {records.length === 0 ? (
                    <p>No records found</p>
                ) : (
                    <ol>
                        {records.map((record, index) => (
                            <li key={index} >
                                날짜: {formatDate(record.diagnosis_date)}
                                <button className='full'  onClick={() => handleItemClick(index)}>[펼쳐보기]</button>
                                {expandedItem === index && (
                                    <div>
                                        <br />
                                        <img src={record.image_url} alt="User uploaded" style={{ width: '100px', height: '100px' }} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
