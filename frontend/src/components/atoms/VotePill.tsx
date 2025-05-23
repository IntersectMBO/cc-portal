import { Box, Typography } from "@mui/material";
import { Vote } from "./types";

export const VotePill = ({
  vote,
  width,
  maxWidth,
}: {
  vote: Vote;
  width?: number;
  maxWidth?: number;
}) => {
  const VOTE = vote.toLowerCase();
  return (
    <Box
      py={0.75}
      px={2.25}
      border={1}
      borderColor={
        VOTE === "constitutional"
          ? "#C0E4BA"
          : VOTE === "unconstitutional"
          ? "#EDACAC"
          : "#99ADDE"
      }
      bgcolor={
        VOTE === "constitutional"
          ? "#F0F9EE"
          : VOTE === "unconstitutional"
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
        data-testid="ga-vote-text"
      >
        {vote}
      </Typography>
    </Box>
  );
};
