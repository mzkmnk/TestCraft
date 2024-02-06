import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate,useLocation } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Typography } from "@mui/material";
import { FaHeart } from "react-icons/fa";

// Exportしなくても使えてる？
function Mysolve() {
  const [workbooks, setWorkbooks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const questionsPerPage = 6;
  const indexOfLastQuestions = currentPage * questionsPerPage;
  const indexOfFirstQuestions = indexOfLastQuestions - questionsPerPage;
  const currentQuestions = workbooks.slice(
    indexOfFirstQuestions,
    indexOfLastQuestions
  );

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
      console.log(API.data.workbook);
    }
  }, [API.data.success, API.data.workbook, API.isSuccess, navigate]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleQuestionClick = (workbookId,solved_count) => {
    navigate(`/solved/${workbookId}/${solved_count}`);
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

  const workbookLists = (
    <>
      {currentQuestions.map((workbook) => (
        <div
          style={styles.question}
          key={workbook.solved_count}
          onClick={() => handleQuestionClick(workbook.id,workbook.solved_count)}
        >
          <div style={styles.questionHeader}>
            <h3>{workbook.workbook_name}</h3>
            <span style={styles.createdBy}>
              created by {workbook.create_id__username} (
              {workbook.created_at})
            </span>
          </div>
          <p>{workbook.description}</p>
          <div style={likeStyle}>
            <FaHeart style={likeIconStyle} />
            <span>{workbook.like_count}</span>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <UserHeader />
      <div style={styles.questionsContainer}>
        {workbooks.length !== 0 ? (
          workbookLists
        ) : (
          <Typography>まだ解答履歴はありません。</Typography>
        )}
      </div>
      <Pagination
        count={Math.ceil(workbooks.length / questionsPerPage)}
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

export default Mysolve;
