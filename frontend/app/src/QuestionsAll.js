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
    fetch('http://localhost:8000/api/questionsall')
      .then(response => response.json())
      .then(data => {
        if(data.success)
        {
          setQuestions(data.workbook);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleQuestionClick = (workbookId) => {
    navigate(`/questionsAll/${workbookId}`);
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

  return (
    <>
      <UserHeader />
      <div style={styles.questionsContainer}>
        {questions.map(question => (
          <div style={styles.question} key={question.workbook_id} onClick={() => handleQuestionClick(question.workbook_id)}>
            <div style={styles.questionHeader}>
              <h3>{question.workbook_name}</h3>
              <span style={styles.createdBy}>created by {question.create_id__username} ({question.create_date})</span>
            </div>
            <p>{question.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default QuestionsAll;
