import { customPalette } from "@consts";
import { Box } from "@mui/material";

export const FullHeightPageWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        height: { xxs: "auto", md: "100vh" },
        backgroundColor: customPalette.arcticWhite,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};
