import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DisplayForms } from "./DisplayForms";

import { useQuestions } from "../context/QuestionsContext";

import { DisplayResult } from "./DisplayResult";

export function AnswerForms({
  exitFunc,
  resultMode = false,
  correctIds = null,
  questionCount = null,
}) {
  const { info, questionTree, rootId } = useQuestions();

  // 入れ子の問題は一ページにまとめる。
  const pages = [rootId, ...questionTree[rootId].childIds];
  const [displayPageIndex, setDisplayPageIndex] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  // 問題遷移
  // 最後の問題では、この関数を実行するボタンは無効化する。
  // （つまり、最初の問題でこの関数が実行されることは想定しない。）
  const handlePrevQuestion = () => {
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
    const nextPageIndex = displayPageIndex + 1;
    setDisplayPageIndex(nextPageIndex);
    if (isFirstQuestion) {
      setIsFirstQuestion(false);
    }
    if (nextPageIndex === pages.length - 1) {
      setIsLastQuestion(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
        position={"fixed"}
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
            <DisplayResult
              questionTree={questionTree}
              questionId={pages[displayPageIndex]}
              correctIds={correctIds}
              questionCount={questionCount}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Box sx={{ padding: 1, margin: 1 }}>
            <Button disabled={isFirstQuestion} onClick={handlePrevQuestion}>
              前へ
            </Button>
          </Box>
          <Box sx={{ padding: 1, margin: 1 }}>
            {isLastQuestion ? (
              <Button onClick={exitFunc}>終了</Button>
            ) : (
              <Button onClick={handleNextQuestion}>次へ</Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
