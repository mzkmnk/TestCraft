import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";

// Exportしなくても使えてる？
function Mysolve() {
  const [workbooks, setWorkbooks] = useState([]);
  const navigate = useNavigate();

  const API = useAPI({
    APIName: "solve_workbook",
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      setWorkbooks(API.data.workbook);
    }
  }, [API.data.success, API.data.workbook, API.isSuccess, navigate]);

  //ここ変更
  const handleQuestionClick = (workbookId) => {
    navigate(`/solved/${workbookId}`);
  };

  const styles = {
    questionsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gridGap: "20px",
      maxHeight: "calc(100vh - 70px)",
      overflowY: "auto",
      padding: "20px",
    },
    question: {
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "8px",
      cursor: "pointer",
    },
    questionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    createdBy: {
      fontSize: "0.8em",
      color: "#666",
      marginLeft: "10px",
    },
  };

  const likeStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    color: "#1DA1F2",
    cursor: "pointer",
  };

  const likeIconStyle = {
    marginRight: "5px",
  };

  return (
    <>
      <UserHeader />
      <div style={styles.questionsContainer}>
        {workbooks.map((workbook) => (
          <div
            style={styles.question}
            key={workbook.workbook__id}
            onClick={() => handleQuestionClick(workbook.workbook__id)}
          >
            <div style={styles.questionHeader}>
              <h3>{workbook.workbook__workbook_name}</h3>
              <span style={styles.createdBy}>
                created by {workbook.workbook_create_id__username} (
                {workbook.workbook__created_at})
              </span>
            </div>
            <p>{workbook.workbook__description}</p>
            <div style={likeStyle}>
              <span style={likeIconStyle}>♥</span>
              <span>{workbook.workbook__like_count}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Mysolve;
