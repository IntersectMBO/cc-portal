import { Box, Typography } from "@mui/material";
import { UserStatus } from "./types";

export const StatusPill = ({
  status,
  width,
  maxWidth,
}: {
  status: UserStatus;
  width?: number;
  maxWidth?: number;
}) => {
  const STATUS = status.toLowerCase();
  return (
    <Box
      py={0.75}
      px={2.25}
      border={1}
      borderColor={
        STATUS === "active"
          ? "#C0E4BA"
          : STATUS === "inactive"
          ? "#EDACAC"
          : "#99ADDE"
      }
      bgcolor={
        STATUS === "active"
          ? "#F0F9EE"
          : STATUS === "inactive"
          ? "#FBEBEB"
          : "#E6EBF7"
      }
      borderRadius={100}
      textAlign="center"
      minWidth="50px"
      maxWidth={maxWidth ? `${maxWidth}px` : "auto"}
      width={width ? `${width}px` : "auto"}
    >
      <Typography
        textTransform="uppercase"
        fontSize={12}
        fontWeight={400}
        lineHeight="16px"
        data-testid="user-status-text"
      >
        {status}
      </Typography>
    </Box>
  );
};
