import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserHeader from './UserHeader';

function Message() {
  const [companyMessages, setCompanyMessages] = useState([]);
  const [otherMessages, setOtherMessages] = useState([]);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8000/api/check_auth", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated === false) {
          navigate("/login");
        } else {
          fetch("http://localhost:8000/api/message", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success === true) {
                console.log('is_company_user',data.is_company_user);
                setIsCompanyUser(data.is_company_user);
                setCompanyMessages(data.message.filter(msg => msg.is_company_send));
                setOtherMessages(data.message.filter(msg => !msg.is_company_send));
              }
            })
            .catch((error) => {
              console.error("Error:", data.error,error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate]);

  const styles = {
    messagesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: '20px',
      padding: '20px',
    },
    message: {
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      background: '#fff',
    },
  }

  return (
    <>
      <UserHeader />
      <div style={styles.messagesContainer}>
        {isCompanyUser && (
          <div>
            <h2>企業からのメッセージ</h2>
            {companyMessages.map((message) => (
              <div style={styles.message} key={message.id}>
                <h3>Message ID: {message.id}</h3>
                <p>{message.message}</p>
              </div>
            ))}
          </div>
        )}
        <div>
          <h2>メッセージ</h2>
          {otherMessages.map((message) => (
            <div style={styles.message} key={message.id}>
              <h3>Message ID: {message.id}</h3>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Message;