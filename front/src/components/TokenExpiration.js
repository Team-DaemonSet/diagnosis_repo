import React, { useState, useEffect } from 'react';
import  {jwtDecode } from 'jwt-decode';

const getTokenExpiration = (token) => {
  const decodedToken = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const remainingTime = expirationTime - currentTime;
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60); // Convert milliseconds to minutes
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // Get remaining seconds
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
    <div className="tokentime">
      {expiration && <p>{expiration.minutes} : {expiration.seconds}</p>}
    </div>
  );
};

export default TokenExpiration;
