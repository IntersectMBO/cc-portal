import { customPalette } from "@/constants";
import { Box, Grid, SxProps } from "@mui/material";
import { CopyButton, Typography } from "../atoms";

interface Props {
  title?: string;
  copyText: string;
  copyValue?: string;
  sx?: SxProps;
  iconSize?: number;
}

export const CopyCard = ({
  title,
  copyText,
  copyValue,
  iconSize,
  sx,
}: Props) => {
  return (
    <Box
      border={`1px solid ${customPalette.lightBlue}`}
      borderRadius="12px"
      px={1.5}
      py={1}
      sx={sx}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography color={customPalette.neutralGray} variant="caption">
            {title}
          </Typography>
          <Typography variant="body2">{copyText}</Typography>
        </Grid>
        <CopyButton size={iconSize} text={copyValue ? copyValue : copyText} />
      </Grid>
    </Box>
  );
};
