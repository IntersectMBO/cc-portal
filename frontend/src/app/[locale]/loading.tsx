import { Box, CircularProgress } from "@mui/material";

export default function CenteredLoading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <CircularProgress color="primary" size={50} thickness={2} />
    </Box>
  );
}
