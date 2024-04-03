import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export const ModalContents = ({ children }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={{ xxs: 0, sm: 3 }}
    >
      {children}
    </Box>
  );
};
