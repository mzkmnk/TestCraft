import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import UserHeader from './UserHeader';

function Message() {
  const [messages, setMessages] = useState([]);
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
                console.log(data.message);
                setMessages(data.message);
              }
            })
            .catch((error) => {
              console.error("Error:", error);
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
      maxHeight: 'calc(100vh - 70px)',
      overflowY: 'auto',
      padding: '20px',
    },
    message: {
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
    },
  }

  return (
    <>
      <UserHeader />
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            style = {styles.message}
            key={message.id}
          >
            <span>{message.message}</span>
            <span>time : {message.timestamp}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Message;

