import { useState } from "react";
import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import UserHeader from "./UserHeader";

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
  answers: { id: Id; value: string }[];
}

type JsonFormat = {
  info: {}; //未定
  questions: QuestionTree;
};

const createId = () =>
  new Date().getTime().toString(32) + Math.random().toString(32);

export default function Editor({ workBook }) {
  console.log(workBook);
  if (!workBook) {
    workBook = {
      info: {},
      questions: {
        [createId()]: {
          questionType: "root",
          title: "新規ドキュメント",
          childIds: [],
        },
      },
    };
  }

  // questionTreeの値は、textareaの入力内容と常に同期する。

  const [questionTree, setQuestionTree] = useState(workBook.questions);
  const [title, setTitle] = useState("初期タイトル");
  // 保存用関数
  function save() {
    workBook = {
      info: {
        title: title,
      },
      questions: questionTree,
    };
    console.log(JSON.stringify(workBook));
    const data = JSON.stringify(workBook);
    fetch("http://localhost:8000/api/save_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("success");
        } else {
          console.log("error", data.error);
        }
      });
  }

  // state更新関数群 React Reducerを使うべきではある（コードが分かりにくくなる && 面倒）
  // optionsとanswersの追加と削除などは、分岐を複雑にして共通化できるが、可読性が下がるのでやらない。
  function handleAddNewOption(updateQuestionId: Id) {
    const updatedQuestion = questionTree[updateQuestionId];
    if (updatedQuestion.questionType === "radio") {
      setQuestionTree({
        ...questionTree,
        [updateQuestionId]: {
          ...updatedQuestion,
          options: [
            ...updatedQuestion.options,
            { id: createId(), value: "new" },
          ],
        },
      });
    }
  }

  function handleAddNewAnswer(updateQuestionId: Id) {
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
            ...updatedQuestion.answers,
            { id: createId(), value: "new" },
          ],
        },
      });
    }
  }

  function handleAddNewQuestion(parentQuestionId: Id) {
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

  // QuestionTypeを変更たびにidも変えないと、muiからstateに登録していないものが変更されていると警告がでる。
  function handleSelectQuestionType(
    selectedType: string,
    updateQuestionId: Id,
    parentId: Id
  ) {
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
        answers: [],
      };
    } else {
      console.log("error : selectedType is undefined ");
      defaultQuestion = {
        questionType: "textarea",
        parentId: parentId,
        question: updatedQuestion.question || "",
        maxlength: "60",
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

  const questionIds = root.childIds;
  return (
    <>
      <UserHeader />
      <Box sx={{ margin: 2 }}>
        <Typography variant="h6">タイトル:</Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
      </Box>
      <Box sx={{ border: 1, margin: 2 }}>
        {questionIds.map((questionId, index) => (
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
          />
        ))}
        <Button onClick={() => handleAddNewQuestion(rootId)}>新規問題</Button>
      </Box>
      <Button onClick={() => save()}>保存</Button>
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
}: Props) {
  const displayQuestion = questionTree[questionId];

  // ルートの場合は終了する
  if (displayQuestion.questionType === "root") {
    return <p>error</p>;
  }
  const questionNumberField = (
    <Typography>{"問題" + questionNumber.join("-") + "："}</Typography>
  );
  const questionField = (
    <>
      <Typography>問題文</Typography>
      <TextField
        defaultValue={displayQuestion.question}
        onChange={(event) => {
          handleChangeText(event.target.value, questionId, "question");
        }}
        fullWidth
      ></TextField>
    </>
  );

  const questionTypes = ["nested", "radio", "textarea"];
  const questionTypeSelector = (
    <>
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
      >
        {questionTypes.map((questionType, index) => (
          <MenuItem key={index} value={questionType}>
            {questionType}
          </MenuItem>
        ))}
      </TextField>
    </>
  );

  if (displayQuestion.questionType === "nested") {
    const AddNewQuestionButton = (
      <>
        <Button onClick={() => handleAddNewQuestion(questionId)}>
          問題を追加
        </Button>
      </>
    );
    return (
      <Box sx={{ border: 1, margin: 2, padding: 2, borderRadius: 2 }}>
        {questionNumberField}
        {questionTypeSelector}
        {questionField}
        {displayQuestion.childIds.map((childId, index) => (
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
          />
        ))}
        {AddNewQuestionButton}
      </Box>
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
              fullWidth
              variant="outlined"
              sx={{ flexGrow: 1, merginRight: 2 }}
            ></TextField>
            <Button
              onClick={() => handleRemoveAnswer(questionId, answers.id)}
              variant="contained"
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
              <TextField
                defaultValue={option.value}
                onChange={(event) => {
                  handleChangeText(
                    event.target.value,
                    questionId,
                    "options",
                    option.id
                  );
                }}
              ></TextField>
              <Button onClick={() => handleRemoveOption(questionId, option.id)}>
                選択肢を削除
              </Button>
            </ListItem>
          ))}
        </List>
        <Button onClick={() => handleAddNewOption(questionId)}>
          選択肢を追加
        </Button>
      </>
    );
    return (
      <Box sx={{ border: 1, margin: 2 }}>
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
        ></TextField>
      </>
    );
    return (
      <Box sx={{ border: 1, margin: 2 }}>
        {questionNumberField}
        {questionTypeSelector}
        {questionField}
        {maxlengthField}
        {answersField}
      </Box>
    );
  }
}
