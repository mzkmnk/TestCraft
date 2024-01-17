import React, { useEffect, useState } from 'react';
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function QuestionsAll() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

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
      console.log(data);
      if (data.success) {
        setQuestions(data.workbooks.map(question => ({
          ...question,
          liked: question.liked_by_user,
        })));
      } else {
        console.log(data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);

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
        console.log(data.success);
        setQuestions(questions.map(question =>
          question.id === workbookId ? { ...question, like_count: data.like_count, liked: !question.liked } : question
        ));
      }else{
        console.log(data.error);
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

  return (
    <>
      <UserHeader />
      <div style={styles.questionsContainer}>
        {questions.map(question => (
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
              style={styles.likeButton}
              onClick={(e) => handleLikeClick(e, question.id)}
            >
              {question.liked ? <FaHeart /> : <FaRegHeart />}
              <span style={styles.likeCount}>{question.like_count}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default QuestionsAll;