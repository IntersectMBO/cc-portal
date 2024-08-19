import { customPalette } from "@/constants";
import { Box, SxProps } from "@mui/material";
import { CopyButton, Typography } from "../atoms";

interface Props {
  copyText: string;
  copyValue?: string;
  sx?: SxProps;
  iconSize?: number;
}

export const CopyPill = ({ copyText, copyValue, iconSize = 14, sx }: Props) => {
  return (
    <Box
      px={2.25}
      py={0.75}
      border={1}
      borderColor={customPalette.lightBlue}
      borderRadius={100}
      display="flex"
      flexWrap="nowrap"
      gap={1}
      sx={sx}
    >
      <CopyButton size={iconSize} text={copyValue ? copyValue : copyText} />
      <Typography variant="caption">{copyText}</Typography>
    </Box>
  );
};
