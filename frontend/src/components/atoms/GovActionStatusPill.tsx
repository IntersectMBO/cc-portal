import { GovActionStatus } from "@/lib/requests";
import { Box, Typography } from "@mui/material";

export const GovActionStatusPill = ({
  status,
  width,
  maxWidth,
}: {
  status: GovActionStatus;
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
        STATUS === "voted"
          ? "#C0E4BA"
          : STATUS === "unvoted"
          ? "#EDACAC"
          : "#99ADDE"
      }
      bgcolor={
        STATUS === "voted"
          ? "#F0F9EE"
          : STATUS === "unvoted"
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
        data-testid="ga-table-vote-status-text"
      >
        {status}
      </Typography>
    </Box>
  );
};
