import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      alignItems="center"
      display="flex"
      flex={1}
      height="100%"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
};
