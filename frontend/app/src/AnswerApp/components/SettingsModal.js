import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { useAnswerSettings } from "../context/AnswerSettingsContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "22rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
  paddingBottom: 2,
  borderRadius: 2,
};

export function SettingsModal({ exitFunc }) {
  const { answerSettings, setAnswerSettings } = useAnswerSettings();
  const [time_min, setTime_min] = useState(
    Math.floor(answerSettings.time / 60)
  );
  const [time_sec, setTime_sec] = useState(answerSettings.time % 60);

  const [notification_min, setNotification_min] = useState(
    Math.floor(answerSettings.notificationTime / 60)
  );
  const [notification_sec, setNotification_sec] = useState(
    answerSettings.notificationTime % 60
  );

  // textfieldの値を取得する
  const handleMinChange = (event) => {
    if (event.target.value === "") {
      setTime_min(0);
    } else {
      setTime_min(event.target.value);
    }
  };

  const handleSecChange = (event) => {
    if (event.target.value === "") {
      setTime_sec(0);
    } else {
      setTime_sec(event.target.value);
    }
  };

  const handleNotificationMinChange = (event) => {
    if (event.target.value === "") {
      setNotification_min(0);
    } else {
      setNotification_min(event.target.value);
    }
  };
  const handleNotificationSecChange = (event) => {
    if (event.target.value === "") {
      setNotification_sec(0);
    } else {
      setNotification_sec(event.target.value);
    }
  };

  // 閉じるときにまとめて設定を反映する
  const finishSetting = () => {
    const time = time_min * 60 + Number(time_sec);
    const notificationTime = notification_min * 60 + Number(notification_sec);
    setAnswerSettings({ ...answerSettings, time, notificationTime });
    exitFunc();
  };

  return (
    <>
      <Modal open={true}>
        <Box sx={style}>
          <Typography marginBottom={1} fontSize={"1.1rem"}>
            解答時間：
          </Typography>
          <Box sx={{ display: "flex", marginBottom: 2 }}>
            <TextField
              label="分"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={time_min}
              onChange={(event) => handleMinChange(event)}
              fullWidth
            />
            <TextField
              label="秒"
              type="number"
              inputProps={{ min: 1, max: 59 }}
              defaultValue={time_sec}
              onChange={(event) => handleSecChange(event)}
              fullWidth
            />
          </Box>
          <Typography marginBottom={1} fontSize={"1.1rem"}>
            警告時間
          </Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="分"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={notification_min}
              onChange={(event) => handleNotificationMinChange(event)}
              fullWidth
            />
            <TextField
              label="秒"
              type="number"
              inputProps={{ min: 1, max: 59 }}
              defaultValue={notification_sec}
              onChange={(event) => handleNotificationSecChange(event)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={finishSetting}>開始</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
