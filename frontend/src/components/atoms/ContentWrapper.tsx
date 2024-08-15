import { Box } from "@mui/material";

export const ContentWrapper = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" flex="1 1 0%">
      {children}
    </Box>
  );
};
