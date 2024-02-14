import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAPI } from "./hooks/useAPI";
import "./workbookList.css";
import Loading from "./Loading";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";

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
  const [displayLoding, setDisplayLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, questionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(questionId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

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

  const deleteAPI = useAPI({
    APIName: "delete_workbook",
  });

  useEffect(() => {
    if (API.isSuccess === false) {
      navigate("/error");
    } else if (API.isSuccess === true && API.data.success === true) {
      setQuestions(API.data.workbook);
      setDisplayLoading(false);
    }
  }, [API.data.success, API.data.workbook, API.isSuccess, deleteAPI, navigate]);

  useEffect(() => {
    if (location.state?.message) {
      setOpenSnackbar(true);
    }
  }, [location]);

  // 削除APIの処理
  useEffect(() => {
    if (deleteAPI.isSuccess === true) {
      API.sendAPI({});
      deleteAPI.statusInit();
    }
  }, [API, deleteAPI]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDelete = () => {
    deleteAPI.sendAPI({ body: JSON.stringify({ workbookId: selectedId }) });
    handleClose();
  };

  return (
    <>
      <UserHeader />
      <div className="body">
        {displayLoding && <Loading />}
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
                <div className="question" key={index}>
                  <Link
                    to={`/editor/${question.id}`}
                    style={{ position: "absolute", inset: 0 }}
                  />
                  <span className="questionHeader">
                    <span>
                      <p style={{ fontSize: "1.5rem" }}>
                        {question.workbook_name}
                      </p>
                      <p className="createdBy">作成日：{formatDate(question.created_at)}</p>
                    </span>
                    <IconButton
                      aria-describedby={index + "popover"}
                      style={{ zIndex: 1, position: "relative" }}
                      onClick={(event) => handleClick(event, question.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      id={index + "popover"}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      elevation={1}
                    >
                      <Button
                        onClick={() => {
                          handleDelete();
                        }}
                      >
                        削除
                      </Button>
                    </Popover>
                  </span>
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
