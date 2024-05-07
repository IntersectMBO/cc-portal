import { customPalette } from "@/constants";
import { Box, Grid } from "@mui/material";
import { CopyButton, Typography } from "../atoms";

interface Props {
  title?: string;
  copyText: string;
}

export const CopyCard = ({ title, copyText }: Props) => {
  return (
    <Box
      border={`1px solid ${customPalette.neutralGray}`}
      borderRadius="12px"
      px={1.5}
      py={1}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color={customPalette.neutralGray} variant="caption">
            {title}
          </Typography>
          <Typography variant="body2">{copyText}</Typography>
        </Grid>
        <CopyButton text={copyText} />
      </Grid>
    </Box>
  );
};
