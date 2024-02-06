import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useTimer } from "../../hooks/useTimer";
import { useAnswerSettings } from "../context/AnswerSettingsContext";

export function InfoHeader({ isTimerActive, TimerFinishedFunc }) {
  const { answerSettings } = useAnswerSettings();
  const Timer = useTimer();
  const { info, questionCount } = useQuestions();
  const { answersCount } = useAnswers();

  // タイマーが停止しているかつisTimerActiveがtrueのとき、タイマーをスタートする
  if (!Timer.isActive && isTimerActive) {
    if (answerSettings.time === 0) {
      TimerFinishedFunc();
      return;
    }
    Timer.set(answerSettings.time);
    Timer.start();
  }

  if (Timer.isFinished) {
    TimerFinishedFunc();
  }

  // タイマーが動いているかつisTimerActiveがfalseのとき、タイマーをストップする
  if (!isTimerActive && Timer.isActive) {
    Timer.stop();
  }

  return (
    <Box sx={{ height: 55 }}>
      <AppBar style={{ position: "fixed", backgroundColor: "#66A666" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {info.title}
          </Typography>
          <Typography sx={{ paddingRight: 10 }}>
            解答数：{answersCount} / {questionCount}
          </Typography>

          <Typography>
            {Timer.time.minutes}分{Timer.time.seconds}秒
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
