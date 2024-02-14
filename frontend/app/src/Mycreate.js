import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAPI } from "./hooks/useAPI";
import "./workbookList.css";
import Loading from "./Loading";

function Mycreate() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

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

  return (
    <>
      <UserHeader />
      <div className="body">
        {API.isLoading && <Loading />}
        {currentQuestions.length !== 0 && (
          <>
            <h2
              style={{
                marginLeft: 1,
              }}
            >
              作成した問題
            </h2>
            <div className="questionsContainer">
              {currentQuestions.map((question, index) => (
                <div
                  className="question"
                  key={index}
                  onClick={() => handleQuestionClick(question.id)}
                >
                  <div className="questionHeader">
                    <h3>{question.workbook_name}</h3>
                    <span className="createdBy">
                      作成日：{formatDate(question.created_at)}
                    </span>
                  </div>
                  <p style={{ margin: "auto" }}>{question.description}</p>
                </div>
              ))}
            </div>
            {questions.length > questionsPerPage && (
              <Pagination
                count={Math.ceil(questions.length / questionsPerPage)}
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
        {currentQuestions.length === 0 && API.isSuccess && (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "1.5rem" }}>まだ問題はありません</p>
            <p>
              <Link to="/editor">作成ページ</Link>
              から、問題を作成してください。
            </p>
          </div>
        )}
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
      </div>
    </>
  );
}

export default Mycreate;
