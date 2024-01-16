import React, { useEffect, useState } from 'react';
import UserHeader from './UserHeader';
import { useNavigate } from 'react-router-dom';

function QuestionsAll() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      }
    )
      .then(response => response.json())
      .then(data => {
        if (data.authenticated === false) {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    fetch('http://localhost:8000/api/questionsall',{
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.success);
        if(data.success)
        {
          setQuestions(data.workbook);
        }
        else
        {
          console.log(data.error);
        }
      })
      .catch(error => {
        console.error('Error:',error);
      });
  }, []);

  const handleQuestionClick = (workbookId) => {
    navigate(`/solve/${workbookId}`);
  };

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
  };

  const likeStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    color: '#1DA1F2',
    cursor: 'pointer',
  };

  const likeIconStyle = {
    marginRight: '5px',
  };

  return (
    <>
      <UserHeader />
      <div style={styles.questionsContainer}>
        {questions.map(question => (
          <div style={styles.question} key={question.id} onClick={() => handleQuestionClick(question.id)}>
            <div style={styles.questionHeader}>
              <h3>{question.workbook_name}</h3>
              <span style={styles.createdBy}>created by {question.create_id__username} ({question.created_at}) </span>
            </div>
            <p>{question.description}</p>
            <div style={likeStyle}>
              <span style={likeIconStyle}>♥</span>
              <span>{question.like_count}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default QuestionsAll;
