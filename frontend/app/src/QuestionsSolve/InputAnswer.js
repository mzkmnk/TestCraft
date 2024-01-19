import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";

export default function InputAnswer({
  questionTree,
  questionIds,
  answers,
  setAnswers,
  finishAnswer,
}) {
  // questionIdsのindex
  const [displayQuestionIndex, setDisplayQuestionIndex] = useState(0);

  // 問題遷移
  const handlePrevQuestion = () => {
    if (displayQuestionIndex === 0) return;
    setDisplayQuestionIndex(displayQuestionIndex - 1);
  };
  const handleNextQuestion = () => {
    if (displayQuestionIndex === questionIds.length - 1) return;
    setDisplayQuestionIndex(displayQuestionIndex + 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
      position={"fixed"}
    >
      <Box
        sx={{
          padding: 1,
          margin: 1,
        }}
      >
        <DisplayQuestion
          questionTree={questionTree}
          questionId={questionIds[displayQuestionIndex]}
          answers={answers}
          setAnswers={setAnswers}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
        }}
      >
        <Box sx={{ padding: 1, margin: 1 }}>
          <Button onClick={handlePrevQuestion}>前へ</Button>
        </Box>
        <Box sx={{ padding: 1, margin: 1 }}>
          <Button onClick={() => finishAnswer()}>終了</Button>
        </Box>
        <Box sx={{ padding: 1, margin: 1 }}>
          <Button onClick={handleNextQuestion}>次へ</Button>
        </Box>
      </Box>
    </Box>
  );
}

function DisplayQuestion({ questionTree, questionId, answers, setAnswers }) {
  const question = questionTree[questionId];

  const handleSetAnswers = (event) => {
    setAnswers({ ...answers, [questionId]: event.target.value });
  };

  if (questionTree[questionId].questionType === "root") {
    return (
      <>
        <Typography align="center" variant="h3">
          {question.title}
        </Typography>
      </>
    );
  } else if (questionTree[questionId].questionType === "nested") {
    return (
      <>
        <Typography>{question.question}</Typography>
        {question.childIds.map((childId) => (
          <DisplayQuestion
            key={childId}
            questionTree={questionTree}
            questionId={childId}
            answers={answers}
            setAnswers={setAnswers}
          />
        ))}
      </>
    );
  } else if (questionTree[questionId].questionType === "radio") {
    return (
      <>
        <Typography>{question.question}</Typography>
        <RadioGroup
          name={questionId}
          onChange={(event) => handleSetAnswers(event)}
          value={answers[questionId] || ""}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.value}
              control={<Radio />}
              label={option.value}
            />
          ))}
        </RadioGroup>
      </>
    );
  } else if (questionTree[questionId].questionType === "textarea") {
    return (
      <>
        {question.question === "" ? null : (
          <Typography>{question.question}</Typography>
        )}
        <TextField
          inputProps={{ maxLength: question.maxlength }}
          onChange={(event) => handleSetAnswers(event)}
          defaultValue={answers[questionId] || ""}
        />
      </>
    );
  }
}
