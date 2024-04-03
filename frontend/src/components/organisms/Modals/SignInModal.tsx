import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";

export const SignInModal = () => {
  return (
    <ModalWrapper dataTestId="sign-in-modal">
      <ModalHeader>Test Modal title</ModalHeader>
      <ModalContents>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Test modal content
        </Typography>
      </ModalContents>
    </ModalWrapper>
  );
};
