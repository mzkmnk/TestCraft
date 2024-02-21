import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import IconButton from "@mui/material/IconButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  overflowY: "auto",
  boxShadow: 24,
  padding: 5,
  borderRadius: 2,
  margin: "0, auto",
  maxWidth: "50rem",
};

export function InfoModal({ open, setOpen }) {
  const [page, setPage] = useState(0);
  const modalRef = useRef(null);
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [page]);

  const handleNext = () => {
    if (pages.length - 1 === page) return;
    setPage((prev) => prev + 1);
  };
  const handleBack = () => {
    if (page === 0) return;
    setPage((prev) => prev - 1);
  };
  const pages = [
    <>
      <Typography>
        このアプリでは、<strong>選択式</strong>、<strong>記述式</strong>、
        <strong>大問式</strong>
        の問題を作成することができます。
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            <strong>大問式</strong>
            は、一つの問題文に対して、複数の選択式、記述式の問題を持つ問題です。
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>選択式</strong>
            では、複数の選択肢のうち、単一選択または複数選択が可能です。
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>記述式</strong>
            では、完全一致またはAIによる採点が可能です。 <strong>AI採点</strong>
            では、問題文と模範解答を元に採点を行います。
          </ListItemText>
        </ListItem>
      </List>
    </>,
    <List>
      <ListItem>
        <ListItemText>
          <strong>解答</strong>
          は複数設定することが可能です。複数選択を許可する場合、すべての解答に一致する場合のみが正解になります。
          それ以外では、いずれかに一致した場合に正解になります。
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <strong>問題文</strong>では、以下の記法を使うことができます。
          <List>
            <ListItem>
              <ListItemText>
                <strong>バッククォート三つ（```）</strong>
                で囲むことによるコードブロック
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <strong>\(TeX記法\)</strong>を用いた<strong>数式</strong>
              </ListItemText>
            </ListItem>
          </List>
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          <strong>編集を完了</strong>
          することで、問題を解くことが可能になります。
        </ListItemText>
      </ListItem>
    </List>,
  ];

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style} ref={modalRef}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: "1.5rem",
                margin: 1,
                marginLeft: 0,
                marginBottom: 2,
              }}
            >
              使い方
            </Typography>
            {pages[page]}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              閉じる
            </Button>
            <Box>
              <IconButton onClick={handleBack} disabled={page === 0}>
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={pages.length - 1 === page}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
