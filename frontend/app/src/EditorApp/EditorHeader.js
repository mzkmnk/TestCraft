import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ExitButton from "@mui/icons-material/LogoutOutlined";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export function EditorHeader({
  saveFunc,
  saveAPI,
  isLatest,
  setIsLatest,
  exitFunc,
}) {
  const [message, setMessage] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const handleClose = (event, reason) => {
    setIsMessageOpen(false);
  };
  let saveStatusIcon;
  if (saveAPI.isLoading === true) {
    saveStatusIcon = (
      <CircularProgress
        size={20}
        sx={{ margin: 1, marginRight: 0, color: "white" }}
      />
    );
  } else if (isLatest === true) {
    saveStatusIcon = <DoneOutlinedIcon />;
  } else if (isLatest === false) {
    saveStatusIcon = (
      <IconButton
        color="inherit"
        onClick={() => {
          saveFunc();
        }}
      >
        <SaveOutlinedIcon />
      </IconButton>
    );
  }

  useEffect(() => {
    if (saveAPI.isSuccess === true) {
      setIsLatest(true);
      saveAPI.statusInit();
      setIsMessageOpen(true);
      setMessage("保存しました");
      setIsSuccess(true);
    } else if (saveAPI.isSuccess === false) {
      setIsLatest(false);
      saveAPI.statusInit();
      setIsMessageOpen(true);
      setMessage("保存に失敗しました");
      setIsSuccess(false);
    }
  }, [saveAPI, setIsLatest]);

  return (
    <>
      <Box sx={{ height: 55 }}>
        <AppBar
          color="secondary"
          style={{
            position: "fixed",
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 2 }}>
              {"問題作成"}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                console.log("info");
              }}
            >
              <InfoOutlinedIcon />
            </IconButton>
            {saveStatusIcon}
            <IconButton color="inherit" onClick={exitFunc}>
              <ExitButton />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar
        open={isMessageOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={isSuccess ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
