import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FaHeart } from "react-icons/fa";
import { useAPI } from "./hooks/useAPI";

function Mycreate() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;
  const indexOfLastQuestions = currentPage * questionsPerPage;
  const indexOfFirstQuestions = indexOfLastQuestions - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestions,
    indexOfLastQuestions
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const API = useAPI({
    APIName: "create_user_workbook",
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      setQuestions(API.data.workbook);
    }
  }, [API.data.success, API.data.workbook, API.isSuccess, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setOpenSnackbar(true);
    }
  }, [location]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleQuestionClick = (workbookId) => {
    navigate(`/editor/${workbookId}`);
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
        {currentQuestions.map((question) => (
          <div
            style={styles.question}
            key={question.id}
            onClick={() => handleQuestionClick(question.id)}
          >
            <div style={styles.questionHeader}>
              <h3>{question.workbook_name}</h3>
              <span style={styles.createdBy}>
                created by {question.create_id__username} ({question.created_at}
                )
              </span>
            </div>
            <p>{question.description}</p>
            <div style={likeStyle}>
              <FaHeart style={likeIconStyle} />
              <span>{question.like_count}</span>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        count={Math.ceil(questions.length / questionsPerPage)}
        page={currentPage}
        onChange={handleChangePage}
      />
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {location.state.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default Mycreate;
