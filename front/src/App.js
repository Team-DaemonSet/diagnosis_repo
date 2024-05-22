import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');  // 결과를 문자열로 받습니다
  const [diagnosis, setDiagnosis] = useState('');  // 진단 결과를 별도로 저장

  // 파일을 선택할 때 호출되는 함수
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // 파일을 서버로 업로드할 때 호출되는 함수
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
      const preprocessResponse = await axios.post('http://localhost:5002/preprocess', {
        file_path: file_path
      });
      const { preprocessed_path } = preprocessResponse.data;

      // Step 3: 모델 예측
      const predictResponse = await axios.post('http://localhost:5003/predict', {
        preprocessed_path: preprocessed_path
      });
      const { outputs } = predictResponse.data;

      // Step 4: 결과 해석
      const interpretResponse = await axios.post('http://localhost:5004/interpret', {
        outputs: outputs
      });
      const interpretation = interpretResponse.data;

      // 진단 결과와 클래스 확률을 별도로 저장
      setDiagnosis(interpretation.Diagnosis);
      const { Diagnosis, ...classProbs } = interpretation;  // Diagnosis를 제외한 나머지 데이터
      setResult(JSON.stringify(classProbs, null, 2)); // JSON 문자열로 변환
    } catch (error) {
      console.error('Upload error', error);
      alert('업로드 실패!');
    }
  };

  return (
    <div>
      <h1>이미지 업로드 및 진단</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>진단</button>
      <div>
        <h3>Results:</h3>
        <p>{diagnosis}</p>  
        <pre>{result}</pre>  
      </div>
    </div>
  );
}

export default App;
