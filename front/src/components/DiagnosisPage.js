import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


const DiagnosisPage = () => {
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [result, setResult] = useState('');
    const [chartData, setChartData] = useState(null); // 차트 데이터를 위한 상태 추가

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
                } catch (error) {
                    console.error('Error fetching user email', error);
                }
            }
        };
        fetchUserEmail();
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('email', email);

        try {
            const token = localStorage.getItem('token');

            const uploadResponse = await axios.post('http://localhost:5001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            const { file_path } = uploadResponse.data;
            console.log("Uploaded file path:", file_path);

            const preprocessResponse = await axios.post('http://localhost:5003/preprocess', {
                file_path: file_path
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const { preprocessed_path } = preprocessResponse.data;

            const predictResponse = await axios.post('http://localhost:5005/predict', {
                preprocessed_path: preprocessed_path
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const { outputs } = predictResponse.data; 


            const interpretResponse = await axios.post('http://localhost:5006/interpret', {
                outputs: outputs
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const interpretation = interpretResponse.data;

            await axios.post('http://localhost:5002/save', {
                email: email,
                s3_url: file_path
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            setDiagnosis(interpretation.Diagnosis);
            const { Diagnosis, "Top 1 Diagnosis": top1, "Top 2 Diagnosis": top2, Others } = interpretation;
            setResult(JSON.stringify({ "Top 1 Diagnosis": top1, "Top 2 Diagnosis": top2 }, null, 2));

            // 차트 데이터를 설정
            const otherTotal = Others.reduce((acc, item) => acc + parseFloat(item.Probability), 0);
            const chartLabels = [top1.Name, top2.Name, 'Others'];
            const chartValues = [parseFloat(top1.Probability), parseFloat(top2.Probability), otherTotal];

            const chartData = {
                labels: chartLabels,
                datasets: [
                    {
                        label: 'Diagnosis Probabilities',
                        data: chartValues,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            setChartData(chartData);

        } catch (error) {
            console.error('Upload error', error);
            alert('업로드 실패! 오류 메시지를 콘솔에서 확인하세요.');
        }
    };

    ChartJS.register(ArcElement, Tooltip, Legend);

    return (
        <div>
            <h1>이미지 업로드 및 진단</h1>
            <div className="upload-section">
                <input type="file" id="file-upload" className="custom-file-input" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="upload-button">파일 선택</label>
                {imagePreviewUrl && <img src={imagePreviewUrl} alt="Selected file preview" className="image-preview" />}
                <button onClick={handleUpload} className="diagnosis-button">진단</button>
            </div>
            <div className="results-section">
                <h3>Results:</h3>
                <p>{diagnosis}</p>
                <pre>{result}</pre>
                {chartData && <Pie data={chartData} />}
            </div>
        </div>
    );
};

export default DiagnosisPage;
