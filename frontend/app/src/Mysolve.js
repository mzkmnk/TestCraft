import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";

function Mysolve() {
  const [questions, setQuestions] = useState([]);
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
          fetch("http://localhost:8000/api/solve_workbook", {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success === true) {
                console.log(data);
                setQuestions(data.workbook);
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
        {questions.map((question) => (
          <div
            style={styles.question}
            key={question.workbook__id}
            onClick={() => handleQuestionClick(question.workbook__id)}
          >
            <div style={styles.questionHeader}>
              <h3>{question.workbook__workbook_name}</h3>
              <span style={styles.createdBy}>
                created by {question.workbook_create_id__username} ({question.workbook__created_at}
                )
              </span>
            </div>
            <p>{question.workbook__description}</p>
            <div style={likeStyle}>
              <span style={likeIconStyle}>♥</span>
              <span>{question.workbook__like_count}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Mysolve;
