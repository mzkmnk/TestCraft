import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import UserHeader from './UserHeader';

function Message() {
  const [companyMessages, setCompanyMessages] = useState([]);
  const [otherMessages, setOtherMessages] = useState([]);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 4;
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = otherMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const navigate = useNavigate();

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

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
                console.log(data.message);
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
      gridTemplateColumns: '1fr',
      gridGap: '20px',
      padding: '20px',
      backgroundColor: '#f9f9f9',
    },
    message: {
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px',
    },
    link: {
      color: '#3273dc',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#3273dc',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: '#2759b5',
      },
    },
  }

  return (
    <>
      <UserHeader />
      <div style={styles.messagesContainer}>
        <div>
          <h2>メッセージ</h2>
          {currentMessages.map((message) => (
            <div style={styles.message} key={message.id}>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
        <Pagination 
          count={Math.ceil(otherMessages.length / messagesPerPage)} 
          page={currentPage} 
          onChange={handleChangePage}
        />
      </div>
    </>
  );
}

export default Message;