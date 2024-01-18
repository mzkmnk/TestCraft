import { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";

// ほぼInputAnswer.jsと同じ
export default function ResultQuestion({
  questionIds,
  questionTree,
  correctIds,
  answers,
  questionCount,
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
    >
      <Box
        sx={{
          padding: 1,
          margin: 1,
        }}
      >
        <DisplayQuestion
          questionId={questionIds[displayQuestionIndex]}
          questionTree={questionTree}
          correctIds={correctIds}
          answers={answers}
          questionCount={questionCount}
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
          <Button onClick={handleNextQuestion}>次へ</Button>
        </Box>
      </Box>
    </Box>
  );
}

function DisplayQuestion({
  questionTree,
  questionId,
  correctIds,
  answers,
  questionCount,
}) {
  const question = questionTree[questionId];
  let color;
  const isCorrect = correctIds.includes(questionId);
  if (isCorrect) {
    color = "success";
  } else {
    color = "error";
  }

  if (questionTree[questionId].questionType === "root") {
    return (
      <>
        <Typography variant="h4">Result</Typography>
        <Typography>
          正答率：{correctIds.length} ／ {questionCount}
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
            questionId={childId}
            questionTree={questionTree}
            correctIds={correctIds}
            answers={answers}
          />
        ))}
      </>
    );
  } else if (questionTree[questionId].questionType === "radio") {
    return (
      <>
        <Typography>{question.question}</Typography>
        <Typography color={color + ".main"}>
          {isCorrect ? "正解" : "不正解"}
        </Typography>
        <RadioGroup name={questionId} value={answers[questionId] || ""}>
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.value}
              control={<Radio inputProps={{ readOnly: true }} color={color} />}
              label={option.value}
            />
          ))}
        </RadioGroup>
      </>
    );
  } else if (questionTree[questionId].questionType === "textarea") {
    return (
      <>
        <Typography>{question.question}</Typography>
        <Typography color={color + ".main"}>
          {isCorrect ? "正解" : "不正解"}
        </Typography>
        <TextField
          inputProps={{ maxLength: question.maxlength, readOnly: true }}
          defaultValue={answers[questionId] || ""}
          color={color}
          focused
        />
      </>
    );
  }
}
