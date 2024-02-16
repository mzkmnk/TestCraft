import { useEffect, useState } from "react";
import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { EditorHeader } from "./EditorHeader";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SwitchableTextField } from "./SwitchableTextField";
import { useAPI } from "../hooks/useAPI";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#3296A0",
    },
    background: {
      default: "#fafafa",
    },
  },
});

type Id = string;

// 問題の型定義
// options、answersなど、順序が変わる可能性があるものは、Reactが識別するための一意の値が必要。
// 順序の変更がしやすいように配列としておく。
type Question = Root | NestedQuestion | RadioQuestion | TextareaQuestion;
type QuestionTree = {
  [key: Id]: Question;
};
interface Root {
  questionType: "root";
  title: string;
  question?: undefined;
  childIds: Id[];
}

interface NestedQuestion {
  questionType: "nested";
  parentId: string;
  question: string;
  childIds: Id[];
}

interface RadioQuestion {
  questionType: "radio";
  parentId: string;
  question: string;
  options: { id: Id; value: string }[];
  canMultiple: boolean;
  answers: { id: Id; value: string }[];
}

interface TextareaQuestion {
  questionType: "textarea";
  parentId: string;
  question: string;
  maxlength: string;
  useAIScoring: boolean;
  answers: { id: Id; value: string }[];
}

const createId = () =>
  new Date().getTime().toString(32) + Math.random().toString(32);

/**
 * エラーケース
 * 1. 問題が一つしかない場合（ルートのみ）
 * 2. ルートがない場合
 * 3. nestedの問題（子）がない場合
 * 4. nestedの問題文がない場合
 * 5. radioの選択肢がない場合
 * 6. radioの選択肢が""の場合
 * 7. radioの解答がない場合
 * 8. radioの解答が""の場合
 * 9. textareaの解答がない場合
 *
 * radioに問題がない場合、textareaに問題がない場合は、エラーではない。
 *
 */
const validationQuestionTree = (questionTree: QuestionTree) => {
  let returnValue: { status: boolean; messages: string[] } = {
    status: true,
    messages: [],
  };
  let keys = Object.keys(questionTree);
  // 問題が一つしかない場合（ルートのみ）
  if (keys.length <= 1) {
    returnValue = {
      status: false,
      messages: [...returnValue.messages, "問題が存在しません"],
    };
  }

  // ルート以下のId
  let questionIds: Id[] = [];

  // ルートがない場合
  for (const key of keys) {
    const question = questionTree[key];
    if (question.questionType === "root") {
      questionIds = question.childIds;
      break;
    } else {
      returnValue = {
        status: false,
        messages: [...returnValue.messages, "ファイルが破損しています。"],
      };
      return returnValue;
    }
  }

  const checkQuestion = (questionId: Id, questionNumber: number[]) => {
    const question = questionTree[questionId];
    if (question === undefined) {
      returnValue = {
        status: false,
        messages: [...returnValue.messages, "ファイルが破損しています。"],
      };
    } else if (question.questionType === "nested") {
      if (question.question === "") {
        returnValue = {
          status: false,
          messages: [
            ...returnValue.messages,
            `問題文がありません。(問題${questionNumber.join("-")})`,
          ],
        };
      }
      if (question.childIds.length === 0) {
        returnValue = {
          status: false,
          messages: [
            ...returnValue.messages,
            `大問式に小問がありません。(問題${questionNumber.join("-")})`,
          ],
        };
      }
      question.childIds.map((id, index) =>
        checkQuestion(id, [...questionNumber, index + 1])
      );
    } else if (question.questionType === "radio") {
      if (question.options.length === 0) {
        returnValue = {
          status: false,
          messages: [
            ...returnValue.messages,
            `選択肢がありません。(問題${questionNumber.join("-")})`,
          ],
        };
      }
      question.options.map((option) => {
        if (option.value === "") {
          returnValue = {
            status: false,
            messages: [
              ...returnValue.messages,
              `選択肢が空です。(問題${questionNumber.join("-")})`,
            ],
          };
        }
      });
      if (question.answers.length === 0) {
        returnValue = {
          status: false,
          messages: [
            ...returnValue.messages,
            `解答がありません。(問題${questionNumber.join("-")})`,
          ],
        };
      }
      question.answers.map((answers, index) => {
        if (answers.value === "") {
          returnValue = {
            status: false,
            messages: [
              ...returnValue.messages,
              `解答が空です。(問題${questionNumber.join("-")})`,
            ],
          };
        }
      });
    } else if (question.questionType === "textarea") {
      if (question.answers.length === 0) {
        returnValue = {
          status: false,
          messages: [
            ...returnValue.messages,
            `解答がありません。(問題${questionNumber.join("-")})`,
          ],
        };
      }
      question.answers.map((answers, index) => {
        if (answers.value === "") {
          returnValue = {
            status: false,
            messages: [
              ...returnValue.messages,
              `解答が空です。(問題${questionNumber.join("-")})`,
            ],
          };
        }
      });
    }
  };
  questionIds.map((id, index) => checkQuestion(id, [index + 1]));
  return returnValue;
};

export default function EditorApp({ workBook }) {
  const location = useLocation();
  const navigate = useNavigate();
  let editingQuestionTree;
  let editingTitle;
  let editingIsEdit;

  if (location.state?.type !== "new") {
    editingQuestionTree = sessionStorage.getItem("editingQuestionTree");
    editingTitle = sessionStorage.getItem("editingTitle");
    editingIsEdit = sessionStorage.getItem("editingIsEdit");
  }

  if (!workBook && editingQuestionTree && editingTitle && editingIsEdit) {
    const editingWorkbook = {
      info: {
        title: editingTitle,
      },
      questions: JSON.parse(editingQuestionTree),
      isEdit: editingIsEdit === "true",
    };
    workBook = editingWorkbook;
  } else if (!workBook) {
    workBook = {
      info: { title: "新規ドキュメント" },
      questions: {
        [createId()]: {
          questionType: "root",
          title: "fake",
          childIds: [],
        },
      },
      isEdit: true,
    };
  }

  // questionTreeの値は、textareaの入力内容と常に同期する。

  const [questionTree, setQuestionTree] = useState(workBook.questions);
  const [title, setTitle] = useState(workBook.info.title);
  const saveAPI = useAPI({ APIName: "save_data" });
  const saveAPIForUpdate = useAPI({ APIName: "save_data" });
  const { workbookId } = useParams();
  const [isLatest, setIsLatest] = useState(false);
  const [isEdit, setIsEdit] = useState(workBook.isEdit);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState(<></>);
  const handleClose = (event, reason) => {
    setIsMessageOpen(false);
  };
  const [isSuccess, setIsSuccess] = useState(null);
  useEffect(() => {
    sessionStorage.setItem("editingQuestionTree", JSON.stringify(questionTree));
    sessionStorage.setItem("editingTitle", title);
    sessionStorage.setItem("editingIsEdit", isEdit);
  }, [questionTree, title, isEdit]);

  useEffect(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (saveAPI.isSuccess === true) {
      navigate("/mypage", {
        state: {
          message: `${title}を保存しました`,
          severity: "success",
        },
      });
    } else if (saveAPI.isSuccess === false) {
      navigate("/error");
    }
  }, [navigate, saveAPI.isSuccess, title]);

  // 保存用関数
  function save() {
    workBook = {
      info: {
        title: title,
        workbook_id: workbookId,
      },
      questions: questionTree,
      isEdit: isEdit,
    };
    const data = JSON.stringify(workBook);
    saveAPI.sendAPI({ body: data });
    console.log("workBookId", workbookId);
  }

  function updateDataInDB() {
    workBook = {
      info: {
        title: title,
        workbook_id: workbookId,
      },
      questions: questionTree,
      isEdit: isEdit,
    };
    const data = JSON.stringify(workBook);
    saveAPIForUpdate.sendAPI({ body: data });
  }

  // state更新関数群 React Reducerを使うべきではある（コードが分かりにくくなる && 面倒）
  // optionsとanswersの追加と削除などは、分岐を複雑にして共通化できるが、可読性が下がるのでやらない。
  function handleAddNewOption(updateQuestionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const updatedQuestion = questionTree[updateQuestionId];
    if (updatedQuestion.questionType === "radio") {
      setQuestionTree({
        ...questionTree,
        [updateQuestionId]: {
          ...updatedQuestion,
          options: [...updatedQuestion.options, { id: createId(), value: "" }],
        },
      });
    }
  }

  function handleAddNewAnswer(updateQuestionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const updatedQuestion = questionTree[updateQuestionId];
    if (
      updatedQuestion.questionType === "radio" ||
      updatedQuestion.questionType === "textarea"
    ) {
      setQuestionTree({
        ...questionTree,
        [updateQuestionId]: {
          ...updatedQuestion,
          answers: [...updatedQuestion.answers, { id: createId(), value: "" }],
        },
      });
    }
  }

  function handleAddNewQuestion(parentQuestionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const parentQuestion = questionTree[parentQuestionId];
    if (
      parentQuestion.questionType === "root" ||
      parentQuestion.questionType === "nested"
    ) {
      const newQuestionId = createId();
      const defaultQuestion: RadioQuestion = {
        questionType: "radio",
        parentId: parentQuestionId,
        question: "",
        options: [],
        canMultiple: false,
        answers: [],
      };
      // 親のchildIdsに追加した上で新規追加
      setQuestionTree({
        ...questionTree,
        [parentQuestionId]: {
          ...parentQuestion,
          childIds: [...parentQuestion.childIds, newQuestionId],
        },
        [newQuestionId]: defaultQuestion,
      });
    }
  }

  function handleRemoveOption(updateQuestionId: Id, removedOptionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const updatedQuestion = questionTree[updateQuestionId];
    if (updatedQuestion.questionType === "radio") {
      setQuestionTree({
        ...questionTree,
        [updateQuestionId]: {
          ...updatedQuestion,
          options: [
            ...updatedQuestion.options.filter(
              (option) => option.id !== removedOptionId
            ),
          ],
        },
      });
    }
  }

  function handleRemoveAnswer(updateQuestionId: Id, removedOptionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const updatedQuestion = questionTree[updateQuestionId];
    if (
      updatedQuestion.questionType === "radio" ||
      updatedQuestion.questionType === "textarea"
    ) {
      setQuestionTree({
        ...questionTree,
        [updateQuestionId]: {
          ...updatedQuestion,
          answers: [
            ...updatedQuestion.answers.filter(
              (answers) => answers.id !== removedOptionId
            ),
          ],
        },
      });
    }
  }

  function handleRemoveQuestion(removedQuestionId: Id) {
    setIsEdit(true);
    setIsLatest(false);
    const removedQuestion = questionTree[removedQuestionId];

    if (removedQuestion.questionType === "root") {
      console.log("error : root don't remove");
      return;
    }

    const updateTree = structuredClone(questionTree);

    // nested なら子をすべて削除する
    if (removedQuestion.questionType === "nested") {
      removedQuestion.childIds.map((id) => delete updateTree[id]);
    }

    // 親から削除する
    const parentQuestion = updateTree[removedQuestion.parentId];
    if (
      parentQuestion.questionType === "root" ||
      parentQuestion.questionType === "nested"
    ) {
      parentQuestion.childIds = parentQuestion.childIds.filter(
        (id) => id !== removedQuestionId
      );
    }

    // オブジェクトを削除し、更新する。
    delete updateTree[removedQuestionId];
    setQuestionTree(updateTree);
  }

  //任意のプロパティの任意の値を変更する
  // options、answersは、changedIdを指定する。
  function handleChangeText(
    updatedValue: string,
    changedQuestionId: Id,
    changedPropertyName: string,
    changedId: string | undefined = undefined
  ) {
    setIsEdit(true);
    setIsLatest(false);

    sessionStorage.setItem("editingQuestionTree", JSON.stringify(questionTree));
    const changedQuestion = questionTree[changedQuestionId];

    if (
      changedId !== undefined &&
      changedPropertyName === "options" &&
      changedQuestion.questionType === "radio"
    ) {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...changedQuestion,
          options: [
            ...changedQuestion.options.map((option) =>
              option.id === changedId
                ? { id: option.id, value: updatedValue }
                : option
            ),
          ],
        },
      });
    } else if (
      changedId !== undefined &&
      changedPropertyName === "answers" &&
      (changedQuestion.questionType === "textarea" ||
        changedQuestion.questionType === "radio")
    ) {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...changedQuestion,
          answers: [
            ...changedQuestion.answers.map((answers) =>
              answers.id === changedId
                ? { id: answers.id, value: updatedValue }
                : answers
            ),
          ],
        },
      });
    } else {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...questionTree[changedQuestionId],
          [changedPropertyName]: updatedValue,
        },
      });
    }
  }

  function handleChangeBool(
    updatedValue: boolean,
    changedQuestionId: Id,
    changedPropertyName: string,
    changedId: string | undefined = undefined
  ) {
    const changedQuestion = questionTree[changedQuestionId];
    setIsEdit(true);
    setIsLatest(false);

    if (
      changedId !== undefined &&
      changedPropertyName === "options" &&
      changedQuestion.questionType === "radio"
    ) {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...changedQuestion,
          options: [
            ...changedQuestion.options.map((option) =>
              option.id === changedId
                ? { id: option.id, value: updatedValue }
                : option
            ),
          ],
        },
      });
    } else if (
      changedId !== undefined &&
      changedPropertyName === "answers" &&
      (changedQuestion.questionType === "textarea" ||
        changedQuestion.questionType === "radio")
    ) {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...changedQuestion,
          answers: [
            ...changedQuestion.answers.map((answers) =>
              answers.id === changedId
                ? { id: answers.id, value: updatedValue }
                : answers
            ),
          ],
        },
      });
    } else {
      setQuestionTree({
        ...questionTree,
        [changedQuestionId]: {
          ...questionTree[changedQuestionId],
          [changedPropertyName]: updatedValue,
        },
      });
    }
  }

  // QuestionTypeを変更たびにidも変えないと、muiからstateに登録していないものが変更されていると警告がでる。
  function handleSelectQuestionType(
    selectedType: string,
    updateQuestionId: Id,
    parentId: Id
  ) {
    setIsEdit(true);
    setIsLatest(false);
    const updatedQuestion = questionTree[updateQuestionId];
    // 同じtypeが選択された場合、終了する
    if (updatedQuestion.questionType === selectedType) {
      return;
    }

    // nestedから別のtypeに変更された場合、子をすべて削除する。
    const updateTree = questionTree;
    if (updatedQuestion.questionType === "nested") {
      updatedQuestion.childIds.map((childId) => delete updateTree[childId]);
    }

    //一度削除する
    delete updateTree[updateQuestionId];

    // タイプごとにデフォルト値を用意
    let defaultQuestion: Question;
    if (selectedType === "nested") {
      defaultQuestion = {
        questionType: "nested",
        parentId: parentId,
        question: "",
        childIds: [],
      };
    } else if (selectedType === "radio") {
      defaultQuestion = {
        questionType: "radio",
        parentId: parentId,
        question: updatedQuestion.question || "",
        canMultiple: false,
        options: [],
        answers: [],
      };
    } else if (selectedType === "textarea") {
      defaultQuestion = {
        questionType: "textarea",
        parentId: parentId,
        question: updatedQuestion.question || "",
        maxlength: "60",
        useAIScoring: false,
        answers: [],
      };
    } else {
      console.log("error : selectedType is undefined ");
      defaultQuestion = {
        questionType: "textarea",
        parentId: parentId,
        question: updatedQuestion.question || "",
        maxlength: "60",
        useAIScoring: false,
        answers: [],
      };
    }

    // 親から削除かつ再登録
    const parentQuestion = updateTree[parentId];
    if (
      parentQuestion.questionType === "root" ||
      parentQuestion.questionType === "nested"
    ) {
      const updatedQuestionIdIndex = parentQuestion.childIds.findIndex(
        (id) => id === updateQuestionId
      );
      const newQuestionId = createId();
      setQuestionTree({
        ...updateTree,
        [parentId]: {
          ...parentQuestion,
          childIds: parentQuestion.childIds.map((id, index) =>
            index === updatedQuestionIdIndex ? newQuestionId : id
          ),
        },
        [newQuestionId]: defaultQuestion,
      });
    }
  }

  // ルートを取得し、再帰的にQuestionEditorを呼び出す。
  let rootId: string;
  let root;
  // ルートの探索
  for (const key of Object.keys(questionTree)) {
    const question = questionTree[key];
    if (question.questionType === "root") {
      rootId = key;
      root = question;
      break;
    }
  }
  // ルートが見つからない場合、終了する。
  if (root === undefined) {
    return (
      <>
        <p>error</p>
      </>
    );
  }
  const handleIsEdit = () => {
    // 編集中が真かつバリデーションが通っている場合、編集中を無効にする。
    if (isEdit && validationQuestionTree(questionTree).status) {
      setIsEdit(false);
    } else if (isEdit && !validationQuestionTree(questionTree).status) {
      setIsEdit(true);
      setIsMessageOpen(true);
      let messages = validationQuestionTree(questionTree).messages;

      let messageJSX = <></>;
      for (const message of messages) {
        messageJSX = (
          <>
            {messageJSX}
            <Typography>{message}</Typography>
          </>
        );
      }

      setMessage(messageJSX);
    } else {
      setIsEdit(!isEdit);
    }
  };

  const questionIds = root.childIds;
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <EditorHeader
          saveFunc={updateDataInDB}
          saveAPI={saveAPIForUpdate}
          isLatest={isLatest}
          setIsLatest={setIsLatest}
          exitFunc={save}
          isEdit={isEdit}
          handleIsEdit={handleIsEdit}
        />
        <Snackbar
          open={isMessageOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={isSuccess ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            margin: "auto",
            maxWidth: "60rem",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              margin: 2,
              marginTop: 3,
              padding: 2,

              borderTop: 12,
              borderColor: "secondary.main",
            }}
          >
            <>
              <TextField
                variant="standard"
                label="タイトル"
                value={title}
                onChange={(e) => {
                  setIsLatest(false);
                  setTitle(e.target.value);
                }}
                margin="normal"
                InputProps={{ style: { fontSize: "2rem" } }}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={!isEdit} onChange={handleIsEdit} />}
                  label="編集を終了"
                />
              </FormGroup>
            </>
          </Paper>

          {questionIds.map((questionId, index) => (
            <Paper
              key={questionId + index}
              elevation={4}
              sx={{
                margin: 2,
                padding: 2,
                borderLeft: 8,
                borderColor: "secondary.main",
              }}
            >
              <QuestionEditor
                key={questionId}
                questionId={questionId}
                questionNumber={[index + 1]}
                questionTree={questionTree}
                handleAddNewOption={handleAddNewOption}
                handleAddNewAnswer={handleAddNewAnswer}
                handleAddNewQuestion={handleAddNewQuestion}
                handleRemoveOption={handleRemoveOption}
                handleRemoveAnswer={handleRemoveAnswer}
                handleRemoveQuestion={handleRemoveQuestion}
                handleChangeText={handleChangeText}
                handleSelectQuestionType={handleSelectQuestionType}
                handleChangeBool={handleChangeBool}
              />
            </Paper>
          ))}

          <Button onClick={() => handleAddNewQuestion(rootId)}>新規問題</Button>
          <Button onClick={() => save()}>保存して終了</Button>
        </Box>
      </ThemeProvider>
    </>
  );
}

interface Props {
  questionId: Id;
  questionNumber: number[]; // 問題番号 表示順から生成
  questionTree: QuestionTree;
  handleAddNewOption: (updateQuestionId: Id) => void;
  handleAddNewAnswer: (updateQuestionId: Id) => void;
  handleAddNewQuestion: (parentQuestionId: Id) => void;
  handleRemoveOption: (updateQuestionId: Id, removedOptionId: Id) => void;
  handleRemoveAnswer: (updateQuestionId: Id, removedOptionId: Id) => void;
  handleRemoveQuestion: (removedQuestionId: Id) => void;
  handleChangeText: (
    updatedValue: string,
    changedQuestionId: Id,
    changedPropertyName: string,
    changedId?: string | undefined
  ) => void;
  handleSelectQuestionType: (
    selectedType: string,
    updateQuestionId: Id,
    parentId: Id
  ) => void;
  handleChangeBool: (
    updatedValue: boolean,
    changedQuestionId: Id,
    changedPropertyName: string,
    changedId?: string | undefined
  ) => void;
}

function QuestionEditor({
  questionId,
  questionNumber,
  questionTree,
  handleAddNewOption,
  handleAddNewAnswer,
  handleAddNewQuestion,
  handleRemoveOption,
  handleRemoveAnswer,
  handleRemoveQuestion,
  handleChangeText,
  handleSelectQuestionType,
  handleChangeBool,
}: Props) {
  const displayQuestion = questionTree[questionId];

  // ルートの場合は終了する
  if (displayQuestion.questionType === "root") {
    return <p>error</p>;
  }
  const questionNumberField = (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ fontSize: "1.15rem" }}>
        {"問題 " + questionNumber.join("-") + "："}
      </Typography>
      <Button onClick={() => handleRemoveQuestion(questionId)} color="error">
        問題を削除
      </Button>
    </Box>
  );
  const questionField = (
    <Box marginBottom={1}>
      <Typography>問題文</Typography>
      <SwitchableTextField
        value={displayQuestion.question}
        setValue={handleChangeText}
        args={[questionId, "question"]}
      ></SwitchableTextField>
    </Box>
  );

  const questionTypes = ["nested", "radio", "textarea"];
  const questionTypeSelector = (
    <Box marginBottom={1}>
      <Typography>問題形式</Typography>
      <TextField
        select
        defaultValue={displayQuestion.questionType}
        onChange={(event) =>
          handleSelectQuestionType(
            event.target.value,
            questionId,
            displayQuestion.parentId
          )
        }
        fullWidth
        sx={{ marginLeft: 1 }}
      >
        {questionTypes.map((questionType, index) => (
          <MenuItem key={index} value={questionType}>
            {questionType === "nested" ? "大問式" : null}
            {questionType === "radio" ? "選択問題" : null}
            {questionType === "textarea" ? "記述式" : null}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );

  if (displayQuestion.questionType === "nested") {
    const AddNewQuestionButton = (
      <>
        <Button onClick={() => handleAddNewQuestion(questionId)}>
          問題を追加（問題{questionNumber.join("-")}へ）
        </Button>
      </>
    );
    return (
      <>
        {questionNumberField}
        {questionTypeSelector}
        {questionField}
        {displayQuestion.childIds.map((childId, index) => (
          <Box key={childId + index} sx={{ marginLeft: 2, marginTop: 4 }}>
            <QuestionEditor
              key={childId}
              questionId={childId}
              questionNumber={[...questionNumber, index + 1]}
              questionTree={questionTree}
              handleAddNewOption={handleAddNewOption}
              handleAddNewAnswer={handleAddNewAnswer}
              handleAddNewQuestion={handleAddNewQuestion}
              handleRemoveOption={handleRemoveOption}
              handleRemoveAnswer={handleRemoveAnswer}
              handleRemoveQuestion={handleRemoveQuestion}
              handleChangeText={handleChangeText}
              handleSelectQuestionType={handleSelectQuestionType}
              handleChangeBool={handleChangeBool}
            />
          </Box>
        ))}
        {AddNewQuestionButton}
      </>
    );
  }

  const answersField = (
    <>
      <Typography>解答</Typography>
      <List>
        {displayQuestion.answers.map((answers) => (
          <ListItem key={answers.id}>
            <TextField
              defaultValue={answers.value}
              onChange={(event) => {
                handleChangeText(
                  event.target.value,
                  questionId,
                  "answers",
                  answers.id
                );
              }}
              variant="outlined"
            ></TextField>
            <Button
              onClick={() => handleRemoveAnswer(questionId, answers.id)}
              color="error"
            >
              解答を削除
            </Button>
          </ListItem>
        ))}
      </List>
      <Button onClick={() => handleAddNewAnswer(questionId)}>解答を追加</Button>
    </>
  );

  if (displayQuestion.questionType === "radio") {
    const optionFieldList = (
      <>
        <Typography>選択肢</Typography>
        <List>
          {displayQuestion.options.map((option) => (
            <ListItem key={option.id}>
              <SwitchableTextField
                value={option.value}
                setValue={handleChangeText}
                args={[questionId, "options", option.id]}
              ></SwitchableTextField>
              <Button
                onClick={() => handleRemoveOption(questionId, option.id)}
                color="error"
              >
                選択肢を削除
              </Button>
            </ListItem>
          ))}
        </List>
        <Button onClick={() => handleAddNewOption(questionId)}>
          選択肢を追加
        </Button>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={displayQuestion.canMultiple}
                onChange={() => {
                  handleChangeBool(
                    !displayQuestion.canMultiple,
                    questionId,
                    "canMultiple"
                  );
                }}
              />
            }
            label="複数選択を許可"
          />
        </FormGroup>
      </>
    );
    return (
      <Box sx={{}}>
        {questionNumberField}
        {questionTypeSelector}
        {questionField}
        {optionFieldList}
        {answersField}
      </Box>
    );
  } else if (displayQuestion.questionType === "textarea") {
    const maxlengthField = (
      <>
        <Typography>最大文字数</Typography>
        <TextField
          type="number"
          defaultValue={displayQuestion.maxlength}
          onChange={(event) => {
            handleChangeText(event.target.value, questionId, "maxlength");
          }}
          sx={{ marginLeft: 1, marginBottom: 1 }}
        ></TextField>
      </>
    );
    return (
      <Box sx={{}}>
        {questionNumberField}
        {questionTypeSelector}
        {questionField}
        {maxlengthField}
        {answersField}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={displayQuestion.useAIScoring}
                onChange={() => {
                  handleChangeBool(
                    !displayQuestion.useAIScoring,
                    questionId,
                    "useAIScoring"
                  );
                }}
              />
            }
            label="AI採点"
          />
        </FormGroup>
      </Box>
    );
  }
}
