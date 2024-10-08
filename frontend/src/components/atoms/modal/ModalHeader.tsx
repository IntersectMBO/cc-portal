import Typography from "@mui/material/Typography";
import type { SxProps } from "@mui/system";

interface Props {
  children: React.ReactNode;
  sx?: SxProps;
}

export const ModalHeader = ({ children, sx }: Props) => (
  <Typography marginBottom="16px" fontSize="22px" fontWeight="500" sx={sx}>
    {children}
  </Typography>
);
