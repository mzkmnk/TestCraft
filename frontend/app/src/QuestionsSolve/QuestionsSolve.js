import { useState } from "react";
import SettingsModal from "./SettingsModal";
import useTimer from "./hooks/useTimer";
import InputAnswer from "./InputAnswer";
import Result from "./Result";
import Watch from "./Watch";
import UserHeader from "../UserHeader";

export default function QuestionsSolve({ workbook }) {
  // JSONはroot が先頭であることを保証しないとする。
  const info = workbook.info;
  const questionTree = workbook.questions;
  const rootId = Object.keys(questionTree).find(
    (key) => questionTree[key].questionType === "root"
  );
  questionTree[rootId] = { ...questionTree[rootId], title: info.title };

  // 表示順に並べる
  const questionIds = [rootId, ...questionTree[rootId].childIds];

  // settingsModal
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [answerSettings, setAnswerSettings] = useState({
    time_min: 0,
    time_sec: 0,
  });
  // 解答。{questionId: answer}
  const [answers, setAnswers] = useState({});
  // Result
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Timer
  // 解答画面の表示条件を0にするので、初期値を0にしない。
  const Timer = useTimer(10);
  const startAnswer = () => {
    setIsSettingsOpen(false);
    // 0分0秒の場合でタイマーを開始するとエラーになるので、その場合は動かさず結果画面を表示する。
    if (answerSettings.time_min === 0 && answerSettings.time_sec === 0) {
      setIsResultOpen(true);
      return;
    }
    Timer.reset(answerSettings.time_min * 60 + answerSettings.time_sec);
    Timer.toggleActive();
  };

  const finishAnswer = () => {
    setIsResultOpen(true);
    Timer.reset();
    Timer.toggleActive();
  };

  if (Timer.seconds === 0) {
    finishAnswer();
  }

  return (
    <>
      <UserHeader position="fixed" />
      {!isSettingsOpen && !isResultOpen ? <Watch time={Timer.seconds} /> : null}
      <SettingsModal
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        answerSettings={answerSettings}
        setAnswerSettings={setAnswerSettings}
        startAnswer={startAnswer}
      />
      {!isResultOpen ? (
        <>
          <InputAnswer
            questionTree={questionTree}
            questionIds={questionIds}
            answers={answers}
            setAnswers={setAnswers}
            finishAnswer={finishAnswer}
          />
        </>
      ) : null}

      {isResultOpen ? (
        <Result
          answers={answers}
          questionTree={questionTree}
          questionIds={questionIds}
        />
      ) : null}
    </>
  );
}
