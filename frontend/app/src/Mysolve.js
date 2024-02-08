import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAPI } from "./hooks/useAPI";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { FaHeart } from "react-icons/fa";
import Loading from "./Loading";
import "./workbookList.css";

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
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleQuestionClick = (workbookId, solved_count) => {
    navigate(`/solved/${workbookId}/${solved_count}`);
  };

  const workbookLists = (
    <>
      {currentQuestions.map((workbook, index) => (
        <div
          className="question"
          key={index}
          onClick={() =>
            handleQuestionClick(workbook.id, workbook.solved_count)
          }
        >
          <div className="questionHeader">
            <h3>{workbook.workbook_name}</h3>
            <span className="createdBy">
              created by {workbook.create_id__username} ({workbook.created_at})
            </span>
          </div>
          <p>{workbook.description}</p>
          <div className="likeStyle">
            <FaHeart className="likeIconStyle" />
            <span>{workbook.like_count}</span>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <UserHeader />
      <div className="body">
        {API.isLoading && <Loading />}
        {workbooks.length !== 0 && (
          <>
            <h2
              style={{
                marginLeft: 1,
              }}
            >
              解答履歴
            </h2>
            <div className="questionsContainer">{workbookLists}</div>
            {workbooks.length > questionsPerPage && (
              <Pagination
                count={Math.ceil(workbooks.length / questionsPerPage)}
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
            <p style={{ fontSize: "1.5rem" }}>まだ解答履歴はありません</p>
            <p>
              <Link to="/questionsAll">解答ページ</Link>
              から、解答を開始してください。
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

export default Mysolve;
