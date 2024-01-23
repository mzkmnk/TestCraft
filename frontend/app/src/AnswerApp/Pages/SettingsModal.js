import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

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

export default function SettingsModal({
  isSettingsOpen,
  setIsSettingsOpen,
  answerSettings,
  setAnswerSettings,
  startAnswer,
}) {
  // ウィンドウ外をクリックしたときにモーダルを閉じないようにする
  const handleClose = (event, reason) => {
    if (reason === "backdropClick") return;
    setIsSettingsOpen(false);
  };

  // textfieldの値を取得する
  const handleMinChange = (event) => {
    if (event.target.value === "") {
      setAnswerSettings({ ...answerSettings, time_min: 0 });
    } else {
      setAnswerSettings({ ...answerSettings, time_min: event.target.value });
    }
  };
  const handleSecChange = (event) => {
    if (event.target.value === "") {
      setAnswerSettings({ ...answerSettings, time_sec: 0 });
    } else {
      setAnswerSettings({ ...answerSettings, time_sec: event.target.value });
    }
  };

  return (
    <>
      <Modal open={isSettingsOpen} onClose={handleClose}>
        <Box sx={style}>
          <Typography>時間：</Typography>
          <Box sx={{ display: "flex" }}>
            <TextField
              label="分"
              type="number"
              inputProps={{ min: 0 }}
              defaultValue={answerSettings.time_min}
              onChange={(event) => handleMinChange(event)}
            />
            <TextField
              label="秒"
              type="number"
              inputProps={{ min: 1, max: 59 }}
              defaultValue={answerSettings.time_sec}
              onChange={(event) => handleSecChange(event)}
            />
          </Box>
          <Button onClick={startAnswer}>開始</Button>
        </Box>
      </Modal>
    </>
  );
}
