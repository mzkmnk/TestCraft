import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';

function MyPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.authenticated === false) {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }, []);
  return (
    <>
      <UserHeader />
    </>
  );
}

export default MyPage;