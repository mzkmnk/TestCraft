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
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { InfoModal } from "./InfoModal";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

export function EditorHeader({
  saveFunc,
  saveAPI,
  isLatest,
  setIsLatest,
  exitFunc,
  isEdit,
  setIsEdit,
  handleIsEdit,
  validateFunc,
}) {
  const [message, setMessage] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const navigate = useNavigate();
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
      if (saveAPI.data.id !== undefined) {
        sessionStorage.setItem("editingWorkbookId", saveAPI.data.id);
      }
      setIsSuccess(true);
    } else if (saveAPI.isSuccess === false) {
      setIsLatest(false);
      saveAPI.statusInit();
      setIsMessageOpen(true);
      setMessage("保存に失敗しました");
      setIsSuccess(false);
    }
  }, [saveAPI, setIsLatest]);

  const exitModal = (
    <Modal
      open={isExitModalOpen}
      onClose={() => {
        setIsExitModalOpen(false);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "25rem",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          position: "relative",
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontSize: "1.4rem" }}
          margin={1}
          marginTop={0}
        >
          終了しますか？
        </Typography>
        <IconButton
          color="error"
          onClick={() => {
            setIsExitModalOpen(false);
          }}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <ClearOutlinedIcon />
        </IconButton>

        <Box margin={1}>
          {validateFunc().status === true ? (
            <>
              <Typography>編集を終了して、問題を解答可能にする</Typography>
              <Button
                color="inherit"
                onClick={handleIsEdit}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {isEdit ? (
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LockIcon color="error" />
                    編集中
                  </Box>
                ) : (
                  <Box component="span">
                    <LockOpenIcon color="success" />
                    解答可能
                  </Box>
                )}
              </Button>
            </>
          ) : (
            <Typography>この問題はまだ解答可能ではありません</Typography>
          )}
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            color="error"
            onClick={() => {
              navigate("/mypage");
            }}
          >
            保存せずに終了
          </Button>
          <Button
            color="primary"
            onClick={() => {
              exitFunc();
            }}
          >
            保存して終了
          </Button>
        </Box>
      </Box>
    </Modal>
  );

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
                setIsInfoOpen(true);
              }}
            >
              <InfoOutlinedIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleIsEdit}>
              {isEdit ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
            {saveStatusIcon}
            <IconButton
              color="inherit"
              onClick={() => {
                console.log("exit");
                setIsExitModalOpen(true);
              }}
            >
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
          severity={isSuccess ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <InfoModal open={isInfoOpen} setOpen={setIsInfoOpen} />
      {exitModal}
    </>
  );
}
