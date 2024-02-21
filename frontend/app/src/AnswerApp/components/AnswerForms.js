import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DisplayForms } from "./DisplayForms";
import { DisplayFormsForSP } from "./DisplayFormsForSP";

import { useQuestions } from "../context/QuestionsContext";
import { DisplayResult } from "./DisplayResult";
import Modal from "@mui/material/Modal";
import { MathJaxContext } from "better-react-mathjax";

export function AnswerForms({
  exitFunc,
  resultMode = false,
  correctIds = null,
  questionCount = null,
  info = null,
  questionTree = null,
  rootId = null,
  answers = null,
  AiComments = null,
}) {
  const QuestionsContext = useQuestions();

  if (info === null) {
    info = QuestionsContext.info;
  }
  if (questionTree === null) {
    questionTree = QuestionsContext.questionTree;
  }
  if (rootId === null) {
    rootId = QuestionsContext.rootId;
  }

  // 入れ子の問題は一ページにまとめる。
  const pages = [rootId, ...questionTree[rootId].childIds];
  const [displayPageIndex, setDisplayPageIndex] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isCheckOpen, setIsCheckOpen] = useState(false);

  // 問題遷移
  const handlePrevQuestion = () => {
    if (displayPageIndex === 0) {
      setIsFirstQuestion(true);
      return;
    }
    const nextPageIndex = displayPageIndex - 1;
    setDisplayPageIndex(nextPageIndex);
    if (isLastQuestion) {
      setIsLastQuestion(false);
    }
    if (nextPageIndex === 0) {
      setIsFirstQuestion(true);
    }
  };

  // 最後の問題では、この関数を実行するボタンは表示しない。
  const handleNextQuestion = () => {
    if (displayPageIndex === pages.length - 1) {
      setIsLastQuestion(true);
      return;
    }
    const nextPageIndex = displayPageIndex + 1;
    setDisplayPageIndex(nextPageIndex);
    if (isFirstQuestion) {
      setIsFirstQuestion(false);
    }
    if (nextPageIndex === pages.length - 1) {
      setIsLastQuestion(true);
    }
  };
  const checkModal = (
    <Modal
      open={isCheckOpen}
      onClose={() => setIsCheckOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          border: "2px solid #4d4d4d",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: "20rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "1.5rem" }}>解答を終了しますか？</p>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
            width: "100%",
          }}
        >
          <Button onClick={() => setIsCheckOpen(false)}>キャンセル</Button>
          <Button onClick={exitFunc}>終了</Button>
        </Box>
      </Box>
    </Modal>
  );

  // スマホの場合
  if (document.documentElement.clientWidth < 700) {
    return (
      <>
        <MathJaxContext>
          <Box
            sx={{
              margin: 3,
              marginTop: 4,
            }}
          >
            {!resultMode ? (
              <DisplayFormsForSP
                info={info}
                questionTree={questionTree}
                questionId={pages[displayPageIndex]}
              />
            ) : (
              <DisplayResult
                questionTree={questionTree}
                questionId={pages[displayPageIndex]}
                correctIds={correctIds}
                questionCount={questionCount}
                answers={answers}
                AiComments={AiComments}
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ padding: 1, margin: 1 }}>
              <Button disabled={isFirstQuestion} onClick={handlePrevQuestion}>
                前へ
              </Button>
            </Box>
            <Box sx={{ padding: 1, margin: 1 }}>
              {isLastQuestion ? (
                <Button onClick={() => setIsCheckOpen(true)}>終了</Button>
              ) : (
                <Button onClick={handleNextQuestion}>次へ</Button>
              )}
            </Box>
          </Box>
          {checkModal}
        </MathJaxContext>
      </>
    );
  }
  // それ以外の場合
  return (
    <>
      <MathJaxContext>
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              padding: 1,
              margin: 1,
            }}
          >
            {!resultMode ? (
              <DisplayForms
                info={info}
                questionTree={questionTree}
                questionId={pages[displayPageIndex]}
              />
            ) : (
              <Box
                sx={{
                  margin: 3,
                  marginTop: 3,
                  maxWidth: "55rem",
                  marginLeft: "auto",
                  marginRight: "auto",
                  height: "calc(100vh - 180px)",
                  overflowY: "auto",
                }}
              >
                <DisplayResult
                  questionTree={questionTree}
                  questionId={pages[displayPageIndex]}
                  correctIds={correctIds}
                  questionCount={questionCount}
                  answers={answers}
                  AiComments={AiComments}
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              position: "fixed",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              bottom: 0,
              backgroundColor: "whitesmoke",
            }}
          >
            <Box sx={{ padding: 1, margin: 1 }}>
              <Button disabled={isFirstQuestion} onClick={handlePrevQuestion}>
                前へ
              </Button>
            </Box>
            <Box sx={{ padding: 1, margin: 1 }}>
              {isLastQuestion ? (
                <Button onClick={() => setIsCheckOpen(true)}>終了</Button>
              ) : (
                <Button onClick={handleNextQuestion}>次へ</Button>
              )}
            </Box>
          </Box>
        </Box>
        {checkModal}
      </MathJaxContext>
    </>
  );
}
