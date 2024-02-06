import { useState } from "react";

import Result from "./Pages/Result";
import { SettingsModal } from "./components/SettingsModal";
import { QuestionsProvider } from "./context/QuestionsContext";
import { AnswersProvider } from "./context/AnswersContext";
import { AnswerForms } from "./components/AnswerForms";
import { useNavigate } from "react-router-dom";
import { InfoHeader } from "./components/InfoHeader";
import { AnswerSettingsProvider } from "./context/AnswerSettingsContext";
import Box from "@mui/material/Box";

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
  // 画面のstate
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const navigate = useNavigate();

  const startInputAnswers = () => {
    setIsSettingsOpen(false);
    setIsResultOpen(false);
    setIsInputOpen(true);
    setIsTimerActive(true);
  };

  const finishInputAnswers = () => {
    setIsInputOpen(false);
    setIsResultOpen(true);
    setIsTimerActive(false);
  };

  return (
    <>
      <Box sx={{ height: "100vh" }}>
        <AnswerSettingsProvider>
          {isSettingsOpen ? (
            <SettingsModal exitFunc={startInputAnswers} />
          ) : null}
          <QuestionsProvider workbook={workbook}>
            <AnswersProvider>
              <InfoHeader
                isTimerActive={isTimerActive}
                TimerFinishedFunc={finishInputAnswers}
              />

              {isInputOpen ? (
                <AnswerForms exitFunc={finishInputAnswers} />
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
        </AnswerSettingsProvider>
      </Box>
    </>
  );
}
