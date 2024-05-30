import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // 올바르게 import

const getTokenExpiration = (token) => {
  const decodedToken = jwtDecode(token); // 올바른 함수 사용
  const expirationTime = decodedToken.exp * 1000; // 밀리초로 변환
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60); // 밀리초를 분으로 변환
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // 남은 초 계산
  return { minutes: remainingMinutes, seconds: remainingSeconds };
};

const TokenExpiration = ({ token }) => {
  const [expiration, setExpiration] = useState(getTokenExpiration(token));

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiration(getTokenExpiration(token));
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="token-expiration">
      {expiration && <p>{expiration.minutes} : {expiration.seconds}</p>}
    </div>
  );
};

export default TokenExpiration;
