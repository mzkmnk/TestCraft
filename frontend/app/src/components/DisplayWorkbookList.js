import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../hooks/useAPI";

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
    position: "relative",
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
  likeStyle: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    color: "#1DA1F2",
    cursor: "pointer",
  },
  likeIconStyle: {
    marginRight: "5px",
  },
  likeButton: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: "pointer",
    height: "24px",
  },
  likeCount: {
    // marginLeft: '10px',
    userSelect: "none",
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

export function DisplayWorkbookList({ workbooks, setWorkbooks }) {
  const API = useAPI({ APIName: "questionsall_like" });
  const navigate = useNavigate();
  const handleQuestionClick = (workbookId) => {
    navigate(`/solve/${workbookId}`);
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
    <div style={styles.questionsContainer}>
      {workbooks.map((question,index) => (
        <div
          style={styles.question}
          key={index}
          onClick={() => handleQuestionClick(question.id)}
        >
          <div style={styles.questionHeader}>
            <h3>{question.workbook_name}</h3>
            <span style={styles.createdBy}>
              created by {question.create_id__username} ({question.created_at})
            </span>
          </div>
          <p>{question.description}</p>
          <div
            style={likeStyle}
            onClick={(e) => handleLikeClick(e, question.id)}
          >
            {question.liked ? (
              <FaHeart style={likeIconStyle} />
            ) : (
              <FaRegHeart style={likeIconStyle} />
            )}
            <span style={styles.likeCount}>{question.like_count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
