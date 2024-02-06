import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { useAnswers } from "../context/AnswersContext";
import { format } from "../../EditorApp/SwitchableTextField";
import { useMemo } from "react";

// 再帰的に問題を表示する関数
export function DisplayFormsForSP({
  info = {},
  questionTree,
  questionId,
  index = 0,
  isNested = false,
}) {
  const { answers, setAnswers } = useAnswers();
  // 今回表示する問題
  const question = questionTree[questionId];

  const questionJsx = useMemo(() => {
    return question.question !== undefined ? format(question.question) : null;
  }, [question.question]);

  const handleSetAnswers = (event) => {
    setAnswers({ ...answers, [questionId]: event.target.value });
  };

  if (questionTree[questionId].questionType === "root") {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 180px)"
      >
        <Typography align="center" variant="h3">
          {info.title}
        </Typography>
      </Box>
    );
  } else if (questionTree[questionId].questionType === "nested") {
    return (
      <>
        <Box marginBottom={6}>{questionJsx}</Box>
        {question.childIds.map((childId, index) => (
          <DisplayFormsForSP
            key={childId}
            questionTree={questionTree}
            questionId={childId}
            answers={answers}
            setAnswers={setAnswers}
            index={index}
            isNested={true}
          />
        ))}
      </>
    );
  } else if (questionTree[questionId].questionType === "radio") {
    return (
      <Box marginBottom={6}>
        {isNested ? (
          <Typography fontSize={"1.1rem"}>{"問題" + (index + 1)}</Typography>
        ) : null}
        {questionJsx}
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
      </Box>
    );
  } else if (questionTree[questionId].questionType === "textarea") {
    return (
      <Box marginBottom={6}>
        {isNested ? (
          <Typography fontSize={"1.1rem"}>{"問題" + (index + 1)}</Typography>
        ) : null}
        {questionJsx}
        <TextField
          inputProps={{ maxLength: question.maxlength }}
          onChange={(event) => handleSetAnswers(event)}
          defaultValue={answers[questionId] || ""}
          multiline
          fullWidth
          rows={4}
        />
      </Box>
    );
  }
}