import React, { useEffect, useState } from 'react';
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function QuestionsAll() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 6;
  const indexOfLastQuestions = currentPage * questionsPerPage;
  const indexOfFirstQuestions = indexOfLastQuestions - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestions, indexOfLastQuestions);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');



  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      if (data.authenticated === false) {
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

    fetch('http://localhost:8000/api/questionsall', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setQuestions(data.workbooks.map(question => ({
          ...question,
          liked: question.liked_by_user,
        })));
      } else {
        console.error(data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [navigate]);

  const handleQuestionClick = (workbookId) => {
    navigate(`/solve/${workbookId}`);
  };

  const handleLikeClick = (e, workbookId) => {
    e.stopPropagation();

    fetch(`http://localhost:8000/api/questionsall/${workbookId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(
        {
          workbook_id: workbookId,
        }
      ),
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
      if(data.success)
      {
        setQuestions(questions.map(question =>
          question.id === workbookId ? { ...question, like_count: data.like_count, liked: !question.liked } : question
        ));
        setSnackbarMessage('いいねしました');
        setOpenSnackbar(true);
      }else{
        console.error(data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  const getLikeStyle = (liked) => ({
    ...styles.likeStyle,
    color: liked ? '#E0245E' : 'transparent',
    border: liked ? 'none' : '2px solid #1DA1F2',
  });

  const styles = {
    questionsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridGap: '20px',
      maxHeight: 'calc(100vh - 70px)',
      overflowY: 'auto',
      padding: '20px',
    },
    question: {
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
      cursor: 'pointer',
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    createdBy: {
      fontSize: '0.8em',
      color: '#666',
      marginLeft: '10px',
    },
    likeStyle: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      color: '#1DA1F2',
      cursor: 'pointer',
    },
    likeIconStyle: {
      marginRight: '5px',
    },
    likeButton: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      cursor: 'pointer',
      height: '24px',
    },
    likeCount: {
      // marginLeft: '10px',
      userSelect: 'none',
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
        {currentQuestions.map(question => (
          <div 
            style={styles.question}
            key={question.id}
            onClick={() => handleQuestionClick(question.id)}
          >
            <div style={styles.questionHeader}>
              <h3>{question.workbook_name}</h3>
              <span style={styles.createdBy}>created by {question.create_id__username} ({question.created_at})</span>
            </div>
            <p>{question.description}</p>
            <div
              style={likeStyle}
              onClick={(e) => handleLikeClick(e, question.id)}
            >
              {question.liked ? <FaHeart style={likeIconStyle} /> : <FaRegHeart style={likeIconStyle} />}
              <span style={styles.likeCount}>{question.like_count}</span>
            </div>
          </div>
        ))}
      </div>
      <Pagination 
          count={Math.ceil(questions.length / questionsPerPage)} 
          page={currentPage} 
          onChange={handleChangePage}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default QuestionsAll;