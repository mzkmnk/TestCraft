import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { useAnswers } from "../context/AnswersContext";

// 再帰的に問題を表示する関数
export function DisplayForms({ info = {}, questionTree, questionId }) {
  const { answers, setAnswers } = useAnswers();
  // 今回表示する問題
  const question = questionTree[questionId];

  const handleSetAnswers = (event) => {
    setAnswers({ ...answers, [questionId]: event.target.value });
  };

  if (questionTree[questionId].questionType === "root") {
    return (
      <>
        <Typography align="center" variant="h3">
          {info.title}
        </Typography>
      </>
    );
  } else if (questionTree[questionId].questionType === "nested") {
    return (
      <>
        <Typography>{question.question}</Typography>
        {question.childIds.map((childId) => (
          <DisplayForms
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