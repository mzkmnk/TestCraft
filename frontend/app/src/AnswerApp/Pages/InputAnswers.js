import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AnswerForms } from "../components/AnswerForms";

export function InputAnswers({ exitFunc, time }) {
  return (
    <>
      <Box sx={{ position: "absolute", right: 10 }}>
        <Typography>
          {time.minutes}分{time.seconds}秒
        </Typography>
      </Box>
      <AnswerForms exitFunc={exitFunc} />
    </>
  );
}
