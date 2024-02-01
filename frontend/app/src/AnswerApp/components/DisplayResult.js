import { useState } from "react";
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

export function DisplayResult({
  questionTree,
  questionId,
  correctIds,
  questionCount,
  answers = null,
}) {
  const answersContext = useAnswers();
  if (answers === null) {
    answers = answersContext.answers;
  }

  const question = questionTree[questionId];
  let color;
  const isCorrect = correctIds.includes(questionId);
  if (isCorrect) {
    color = "success";
  } else {
    color = "error";
  }
  const questionJsx = useMemo(() => {
    return question.question !== undefined ? format(question.question) : null;
  }, [question.question]);

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
        {questionJsx}
        {question.childIds.map((childId) => (
          <DisplayResult
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
        {questionJsx}
        <Typography color={color + ".main"}>
          {isCorrect ? "正解" : "不正解"}
        </Typography>
        <RadioGroup name={questionId} value={answers[questionId] || "未回答"}>
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
        {questionJsx}
        <Typography color={color + ".main"}>
          {isCorrect ? "正解" : "不正解"}
        </Typography>
        <TextField
          inputProps={{ readOnly: true }}
          defaultValue={answers[questionId] || "未回答"}
          color={color}
          focused
        />
      </>
    );
  }
}
