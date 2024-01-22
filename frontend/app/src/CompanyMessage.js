import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import UserHeader from './UserHeader';

function CompanyMessage() {
  const [companyMessages, setCompanyMessages] = useState([]);
  const [otherMessages, setOtherMessages] = useState([]);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 4;
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = companyMessages.slice(indexOfFirstMessage, indexOfLastMessage);
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
        <h2>企業からのメッセージ</h2>
        {currentMessages.map((message) => (
            <div style={styles.message} key={message.id}>
            <p>{message.message}</p>
            <p>{new Date(message.timestamp).toLocaleString('ja-JP',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }
            )}
            </p>
            <ul>
                {message.workbooks && Object.entries(message.workbooks).map(([id, workbookName]) => (
                <li key={id}>
                    {`ワークブック名: ${workbookName}`}
                    <a href={`http://localhost:3000/solve/${id}`} target="_blank" rel="noopener noreferrer">問題を解く</a>
                </li>
                ))}
            </ul>
            </div>
        ))}
        </div>
        <Pagination 
          count={Math.ceil(companyMessages.length / messagesPerPage)} 
          page={currentPage} 
          onChange={handleChangePage}
        />
      </div>
    </>
  );
}

export default CompanyMessage;