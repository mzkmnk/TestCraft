import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useTimer } from "../../hooks/useTimer";
import { useAnswerSettings } from "../context/AnswerSettingsContext";

const mainAppBarColor = "#4caf50";
export function InfoHeader({ isTimerActive, TimerFinishedFunc }) {
  const { answerSettings } = useAnswerSettings();
  const Timer = useTimer({ notificationTime: answerSettings.notificationTime });
  const { info, questionCount } = useQuestions();
  const { answersCount } = useAnswers();
  const [appBarColor, setAppBarColor] = useState(mainAppBarColor);

  useEffect(() => {
    if (Timer.isActive && Timer.isNotificationTime && appBarColor !== "red") {
      setAppBarColor("red");
    } else if (Timer.isFinished) {
      TimerFinishedFunc();
      setAppBarColor(mainAppBarColor);
      // タイマーが動いているかつisTimerActiveがfalseのとき、タイマーをストップする
    } else if (!isTimerActive && Timer.isActive) {
      Timer.stop();
      setAppBarColor(mainAppBarColor);
    }
  }, [Timer, TimerFinishedFunc, appBarColor, isTimerActive]);

  // タイマーが停止しているかつisTimerActiveがtrueのとき、タイマーをスタートする
  if (!Timer.isActive && isTimerActive) {
    if (answerSettings.time === 0) {
      TimerFinishedFunc();
      return;
    }
    Timer.set(answerSettings.time);
    Timer.start();
  }

  return (
    <Box sx={{ height: 55 }}>
      <AppBar
        style={{
          position: "fixed",
          backgroundColor: appBarColor,
          transition: "background-color 1s ",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
            {info.title}
          </Typography>
          <Typography sx={{ paddingRight: 5 }}>
            {answersCount} / {questionCount}
          </Typography>

          <Typography>
            {Timer.time.minutes}分{Timer.time.seconds}秒
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
