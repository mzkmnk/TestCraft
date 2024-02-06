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
  width: "400",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export function SettingsModal({ exitFunc }) {
  const { answerSettings, setAnswerSettings } = useAnswerSettings();
  const [time_min, setTime_min] = useState(
    Math.floor(answerSettings.time / 60)
  );

  const [time_sec, setTime_sec] = useState(answerSettings.time % 60);

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

  // 閉じるときにまとめて設定を反映する
  const finishSetting = () => {
    const time = time_min * 60 + time_sec;
    setAnswerSettings({ ...answerSettings, time });
    exitFunc();
  };

  return (
    <>
      <Modal open={true}>
        <Box sx={style}>
          <Typography>時間：</Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="分"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={time_min}
              onChange={(event) => handleMinChange(event)}
            />
            <TextField
              label="秒"
              type="number"
              inputProps={{ min: 1, max: 59 }}
              defaultValue={time_sec}
              onChange={(event) => handleSecChange(event)}
            />
          </Box>
          <Button onClick={finishSetting}>開始</Button>
        </Box>
      </Modal>
    </>
  );
}
