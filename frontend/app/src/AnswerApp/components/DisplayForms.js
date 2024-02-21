import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { useAnswers } from "../context/AnswersContext";
import { format } from "../../EditorApp/SwitchableTextField";
import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";

// 再帰的に問題を表示する関数
export function DisplayForms({ info = {}, questionTree, questionId }) {
  const { answers, setAnswers } = useAnswers();
  const handleSetAnswers = (event, id = questionId) => {
    setAnswers({ ...answers, [id]: event.target.value });
  };

  const handleCheckBoxAnswers = (event, questionId) => {
    let updateValue = {};

    if (event.target.checked) {
      if (answers[questionId] === undefined) {
        updateValue = {
          ...answers,
          [questionId]: [event.target.value],
        };
      } else {
        updateValue = {
          ...answers,
          [questionId]: [...answers[questionId], event.target.value],
        };
      }
    } else {
      updateValue = {
        ...answers,
        [questionId]: answers[questionId].filter(
          (value) => value !== event.target.value
        ),
      };
    }
    setAnswers(updateValue);
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
          return questionTree[childId].question !== ""
            ? `問題${index + 1}\n` + questionTree[childId].question + ""
            : "";
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
        handleCheckBoxAnswers={handleCheckBoxAnswers}
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
        handleCheckBoxAnswers={handleCheckBoxAnswers}
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
  handleCheckBoxAnswers,
}) {
  const marginBottom = 2;
  if (question.questionType === "radio") {
    return (
      <Box marginBottom={marginBottom}>
        {isNested ? (
          <Typography fontSize={"1.1rem"}>{"問題" + (index + 1)}</Typography>
        ) : null}
        {question.canMultiple ? (
          <FormGroup>
            {question.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.value}
                control={<Checkbox />}
                label={format(option.value)}
                checked={
                  answers[questionId] !== undefined &&
                  answers[questionId].includes(option.value)
                }
                onChange={(e) => {
                  handleCheckBoxAnswers(e, questionId);
                }}
              />
            ))}
          </FormGroup>
        ) : (
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
                label={format(option.value)}
              />
            ))}
          </RadioGroup>
        )}
      </Box>
    );
  } else if (question.questionType === "textarea") {
    return (
      <Box marginBottom={marginBottom}>
        {isNested ? (
          <Typography fontSize={"1.1rem"}>{"問題" + (index + 1)}</Typography>
        ) : null}
        <TextField
          inputProps={{ maxLength: question.maxlength }}
          onChange={(event) => handleSetAnswers(event, questionId)}
          value={answers[questionId] || ""}
          multiline
          fullWidth
          rows={8}
        />
      </Box>
    );
  }
}
