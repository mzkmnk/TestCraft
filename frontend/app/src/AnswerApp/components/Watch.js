import { Box, Typography } from "@mui/material";

export default function Watch({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return (
    <Box sx={{ marginTop: 10, position: "absolute", right: 10 }}>
      <Typography>
        {minutes}分{seconds}秒
      </Typography>
    </Box>
  );
}
