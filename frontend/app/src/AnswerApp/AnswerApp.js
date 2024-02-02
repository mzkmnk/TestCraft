import { useState } from "react";
import { useTimer } from "../hooks/useTimer";
import Result from "./Pages/Result";
import UserHeader from "../UserHeader";
import { SettingsModal } from "./components/SettingsModal";
import { QuestionsProvider } from "./context/QuestionsContext";
import { AnswersProvider } from "./context/AnswersContext";
import { InputAnswers } from "./Pages/InputAnswers";
import { useNavigate } from "react-router-dom";

const defaultAnswerSettings = {
  /**単位は秒 */
  time: 300,
};

/**
 * 問題を解くアプリ。画面の切り替えとタイマーの管理の役割を持つ。
 * タイマーの描画は、InputAnswersで行う。
 *
 * 画面の切り替えは、以下の流れで行う。
 * 1. 問題データを受け取り、設定画面を開く。@see SettingsModal
 * 2. 設定を終えると、問題を解く画面を表示する。
 * 3. 問題を解き終えると、結果画面を表示する。
 *
 * @param {object} workbook 問題データ
 */

export default function AnswersApp({ workbook }) {
  const [answerSettings, setAnswerSettings] = useState(defaultAnswerSettings);
  // 画面のstate
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const navigate = useNavigate();

  const Timer = useTimer();

  const startInputAnswers = () => {
    setIsSettingsOpen(false);

    if (answerSettings.time === 0) {
      setIsResultOpen(true);
      return;
    }

    setIsResultOpen(false);
    setIsInputOpen(true);

    Timer.set(answerSettings.time);
    Timer.start();
  };

  const finishInputAnswers = () => {
    setIsInputOpen(false);
    setIsResultOpen(true);
    Timer.stop();
  };

  if (Timer.isFinished) {
    finishInputAnswers();
  }

  return (
    <>
      <UserHeader position="fixed" />
      {isSettingsOpen ? (
        <SettingsModal
          exitFunc={startInputAnswers}
          answerSettings={answerSettings}
          setAnswerSettings={setAnswerSettings}
        />
      ) : null}
      <QuestionsProvider workbook={workbook}>
        <AnswersProvider>
          {isInputOpen ? (
            <InputAnswers exitFunc={finishInputAnswers} time={Timer.time} />
          ) : null}
          {isResultOpen ? (
            <Result
              exitFunc={() => {
                navigate("/mypage");
              }}
            />
          ) : null}
        </AnswersProvider>
      </QuestionsProvider>
    </>
  );
}
