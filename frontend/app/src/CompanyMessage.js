import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";
import Loading from "./Loading";

function CompanyMessage() {
  const [companyMessages, setCompanyMessages] = useState([]);
  const [otherMessages, setOtherMessages] = useState([]);
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 4;
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = companyMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const navigate = useNavigate();

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const API = useAPI({
    APIName: "message",
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      const data = API.data;
      setIsCompanyUser(data.is_company_user);
      setCompanyMessages(data.message.filter((msg) => msg.is_company_send));
      setOtherMessages(data.message.filter((msg) => !msg.is_company_send));
    }
  }, [API.data, API.isSuccess, navigate]);

  const styles = {
    messagesContainer: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gridGap: "20px",
      padding: 20,
      paddingLeft: "3rem",
      paddingRight: "3rem",
      maxWidth: "70rem",
      margin: "0 auto",
    },
    message: {
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginBottom: "20px",
    },
    link: {
      color: "#3273dc",
      textDecoration: "none",
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#3273dc",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 20px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      "&:hover": {
        backgroundColor: "#2759b5",
      },
    },
  };

  return (
    <>
      <UserHeader />
      {API.isLoading && <Loading />}
      <div style={styles.messagesContainer}>
        <div>
          {companyMessages.length !== 0 && (
            <>
              <h2 style={{ marginBottom: 10 }}>企業からのメッセージ</h2>
              {currentMessages.map((message) => (
                <div style={styles.message} key={message.id}>
                  <p>{message.message}</p>
                  <p>
                    {new Date(message.timestamp).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <ul>
                    {message.workbooks &&
                      Object.entries(message.workbooks).map(
                        ([id, workbookName]) => (
                          <li key={id}>
                            {`ワークブック名: ${workbookName}`}
                            <a
                              href={`http://localhost:3000/solve/${id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              問題を解く
                            </a>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              ))}
              {companyMessages.length > messagesPerPage && (
                <Pagination
                  count={Math.ceil(companyMessages.length / messagesPerPage)}
                  page={currentPage}
                  onChange={handleChangePage}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              )}
            </>
          )}
          {API.isSuccess && companyMessages.length === 0 && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "1.5rem" }}>メッセージはありません。</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CompanyMessage;
