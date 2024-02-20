import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuestions } from "../context/QuestionsContext";
import { useAnswers } from "../context/AnswersContext";
import { useTimer } from "../../hooks/useTimer";
import { useAnswerSettings } from "../context/AnswerSettingsContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const mainAppBarColor = "#4caf50";
export function InfoHeader({ isTimerStart, TimerFinishedFunc }) {
  const { answerSettings } = useAnswerSettings();
  const Timer = useTimer({ notificationTime: answerSettings.notificationTime });
  const { info, questionCount } = useQuestions();
  const { answersCount } = useAnswers();
  const [appBarColor, setAppBarColor] = useState(mainAppBarColor);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    if (
      Timer.isActive &&
      !isNotified &&
      Timer.isNotificationTime &&
      appBarColor !== "red"
    ) {
      setIsSnackbarOpen(true);
      setIsNotified(true);
      setAppBarColor("red");
    } else if (Timer.isFinished) {
      TimerFinishedFunc();
      setAppBarColor(mainAppBarColor);
    }
  }, [Timer, TimerFinishedFunc, appBarColor, isTimerStart]);

  if (isTimerStart && !Timer.isActive && !Timer.isFinished) {
    if (answerSettings.time === 0) {
      TimerFinishedFunc();
      return;
    }
    Timer.set(answerSettings.time);
    Timer.start();
  }
  if (!isTimerStart && Timer.isActive) {
    Timer.stop();
  }

  return (
    <>
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
              {Timer.time.hour}:{Timer.time.minutes}:{Timer.time.seconds}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={2000}
        onClose={() => setIsSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={"error"} variant="filled" sx={{ width: "100%" }}>
          警告時間です
        </Alert>
      </Snackbar>
    </>
  );
}
