import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const DiagnosisPage = () => {
    const [file, setFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [result, setResult] = useState('');

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
    
        try {
            // Step 1: 파일 업로드
            const uploadResponse = await axios.post('http://localhost:5001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { file_path } = uploadResponse.data;
    
            // Step 2: 이미지 전처리
            const preprocessResponse = await axios.post('http://localhost:5003/preprocess', {
                file_path: file_path
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { preprocessed_path } = preprocessResponse.data;
    
            // Step 3: 모델 예측
            const predictResponse = await axios.post('http://localhost:5005/predict', {
                preprocessed_path: preprocessed_path
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const { outputs } = predictResponse.data;
    
            // Step 4: 결과 해석
            const interpretResponse = await axios.post('http://localhost:5006/interpret', {
                outputs: outputs
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const interpretation = interpretResponse.data;
    
            setDiagnosis(interpretation.Diagnosis);
            const { Diagnosis, ...classProbs } = interpretation; 
            setResult(JSON.stringify(classProbs, null, 2)); 
        } catch (error) {
            console.error('Upload error', error);
            alert('업로드 실패! 오류 메시지를 콘솔에서 확인하세요.');
        }
    };
    

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
            </div>
        </div>
    );
};

export default DiagnosisPage;
