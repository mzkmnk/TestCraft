import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { useAPI } from "../hooks/useAPI";
import "../workbookList.css";

export function DisplayWorkbookList({ workbooks, setWorkbooks }) {
  const API = useAPI({ APIName: "questionsall_like" });
  const navigate = useNavigate();
  const handleQuestionClick = (workbookId) => {
    navigate(`/solve/${workbookId}`);
  };

  // pagenation
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;
  const indexOfLastQuestions = currentPage * questionsPerPage;
  const indexOfFirstQuestions = indexOfLastQuestions - questionsPerPage;
  const currentQuestions = workbooks.slice(
    indexOfFirstQuestions,
    indexOfLastQuestions
  );
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  // いいねボタン
  const handleLikeClick = (e, workbookId) => {
    e.stopPropagation();

    // 同じアカウントが同じworkbookIdでAPIを送信すると反転する？
    API.sendAPI({
      body: JSON.stringify({ workbook_id: workbookId }),
      params: workbookId,
    });
    // 今のデータ構造では、APIの完了を待つのは無理そう。
    setWorkbooks(
      workbooks.map((workbook) =>
        workbook.id === workbookId
          ? {
              ...workbook,
              like_count: !workbook.liked
                ? workbook.like_count + 1
                : workbook.like_count - 1,
              liked: !workbook.liked,
            }
          : workbook
      )
    );
  };

  return (
    <div className="body">
      {workbooks.length !== 0 ? (
        <>
          <h2
            style={{
              marginLeft: 1,
            }}
          >
            問題一覧
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
                    created by {question.create_id__username} (
                    {formatDate(question.created_at)})
                  </span>
                </div>
                <p>{question.description}</p>
                <div
                  className="likeStyle"
                  onClick={(e) => handleLikeClick(e, question.id)}
                >
                  {question.liked ? (
                    <FaHeart className="likeIconStyle" />
                  ) : (
                    <FaRegHeart className="likeIconStyle" />
                  )}
                  <span className="likeCount">{question.like_count}</span>
                </div>
              </div>
            ))}
          </div>
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
      ) : (
        <>
          {" "}
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
        </>
      )}
    </div>
  );
}
