import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 64px)"
    >
      <CircularProgress size={60} color="grey" style={{ opacity: 0.4 }} />
    </Box>
  );
}
