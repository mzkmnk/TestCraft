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
import Grid from "@mui/material/Grid";

// 再帰的に問題を表示する関数
export function DisplayForms({ info = {}, questionTree, questionId }) {
  const { answers, setAnswers } = useAnswers();
  const handleSetAnswers = (event, id = questionId) => {
    setAnswers({ ...answers, [id]: event.target.value });
  };
  // 今回表示する問題
  const question = questionTree[questionId];

  // 問題文
  let questionText = undefined;
  let inputField = undefined;
  if (question.questionType === "root") {
  } else if (question.questionType === "nested") {
    questionText =
      question.question +
      "\n\n" +
      question.childIds
        .map((childId, index) => {
          return `問題${index + 1}\n` + questionTree[childId].question + "";
        })
        .join("\n\n");

    inputField = question.childIds.map((childId, index) => (
      <FormatInputField
        key={childId}
        question={questionTree[childId]}
        questionId={childId}
        answers={answers}
        handleSetAnswers={handleSetAnswers}
        index={index}
        isNested={true}
      />
    ));
  } else {
    questionText = question.question;
    inputField = (
      <FormatInputField
        question={question}
        questionId={questionId}
        answers={answers}
        handleSetAnswers={handleSetAnswers}
        index={0}
      />
    );
  }
  // 数式、コードブロックの処理
  const questionJsx = useMemo(() => {
    return questionText !== undefined ? format(questionText) : null;
  }, [questionText]);

  // 表示するもの
  let leftJsx = questionJsx;
  let rightJsx = inputField;

  if (questionTree[questionId].questionType === "root") {
    leftJsx = (
      <>
        <Typography align="center" variant="h3">
          {info.title}
        </Typography>
      </>
    );
  }

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={6}
          style={{
            overflowX: "hidden",
            overflowY: "scroll",
            height: "calc(100vh - 145px)",
          }}
        >
          <Box sx={{ margin: 2 }}>{leftJsx}</Box>
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            overflowX: "hidden",
            overflowY: "scroll",
            height: "calc(100vh - 145px)",
          }}
        >
          <Box sx={{ margin: 2 }}>{rightJsx}</Box>
        </Grid>
      </Grid>
    </>
  );
}

function FormatInputField({
  question,
  questionId,
  answers,
  handleSetAnswers,
  index,
  isNested = false,
}) {
  const marginBottom = 2;
  console.log(questionId);
  console.log(answers);
  if (question.questionType === "radio") {
    return (
      <Box marginBottom={marginBottom}>
        {isNested ? <Typography>{"問題" + (index + 1)}</Typography> : null}
        <RadioGroup
          name={questionId}
          onChange={(event) => handleSetAnswers(event, questionId)}
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
  } else if (question.questionType === "textarea") {
    return (
      <Box marginBottom={marginBottom}>
        {isNested ? <Typography>{"問題" + (index + 1)}</Typography> : null}
        <TextField
          inputProps={{ maxLength: question.maxlength }}
          onChange={(event) => handleSetAnswers(event, questionId)}
          defaultValue={answers[questionId] || ""}
          multiline
          fullWidth
          maxRows={8}
          rows={8}
        />
      </Box>
    );
  }
}
