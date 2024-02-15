import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from '@mui/material/Grid';

import { useAPI } from "../hooks/useAPI";
import "../workbookList.css";

export function DisplayWorkbookList({ workbooks, setWorkbooks }) {
  const [sortOption, setSortOption] = useState("date");
  const [sortedWorkbooks, setSortedWorkbooks] = useState([]);
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
  const currentQuestions = sortedWorkbooks.slice(
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

  const handleSortChange = (event) => {setSortOption(event.target.value)};

  useEffect(() => {
    let sorted = [...workbooks];
    switch(sortOption){
      case "date":
        sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        break
      case "likes":
        sorted.sort((a,b) => b.like_count - a.like_count);
        break
      case "likesByMe":
        sorted = sorted.filter((workbook) => workbook.liked);
        break
      default:
        break
    }
    setSortedWorkbooks(sorted);
  },[workbooks, sortOption]);

  return (
    <div className="body">
      <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
          <h2>問題一覧</h2>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" size="small">
            <InputLabel id="sort-select-label">ソートオプション</InputLabel>
            <Select
              labelId="sort-select-label"
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              label="ソートオプション"
            >
              <MenuItem value="date">日付順</MenuItem>
              <MenuItem value="likes">いいねが多い順</MenuItem>
              <MenuItem value="likesByMe">自分がいいねした問題</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {workbooks.length !== 0 ? (
        <>
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
