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
  AiComments,
  answers = null,
  index = 0,
  isNested = false,
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 180px)"
      >
        <Box>
          <Typography variant="h3" align="center">
            Result
          </Typography>
          <Typography align="center">
            正答率：{correctIds.length} ／ {questionCount}
          </Typography>
        </Box>
      </Box>
    );
  } else if (questionTree[questionId].questionType === "nested") {
    return (
      <>
        <Box marginBottom={6}>{questionJsx}</Box>
        {question.childIds.map((childId, index) => (
          <DisplayResult
            key={childId}
            questionId={childId}
            questionTree={questionTree}
            correctIds={correctIds}
            answers={answers}
            AiComments={AiComments}
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
      </Box>
    );
  } else if (questionTree[questionId].questionType === "textarea") {
    console.log("AIComments", AiComments);
    return (
      <Box marginBottom={6}>
        {isNested ? (
          <Typography fontSize={"1.1rem"}>{"問題" + (index + 1)}</Typography>
        ) : null}
        {questionJsx}
        <Typography color={color + ".main"}>
          {isCorrect ? "正解" : "不正解"}
        </Typography>
        <TextField
          inputProps={{ readOnly: true }}
          defaultValue={answers[questionId] || "未回答"}
          color={color}
          focused
          multiline
          fullWidth
        />
        {questionTree[questionId].useAIScoring ? (
          <Box
            sx={{
              borderLeft: "double 7px",
              borderRight: "double 7px",
              borderColor: "#33ab9f",
              marginTop: 2,
              marginBottom: 2,
              padding: 2,
              backgroundColor: "whitesmoke",
            }}
          >
            <Typography
              variant="h6"
              fontStyle={"italic"}
              style={{ opacity: 0.4, fontStyle: "oblique" }}
            >
              AIコメント
            </Typography>
            {format(AiComments[questionId])}
          </Box>
        ) : null}
      </Box>
    );
  }
}
