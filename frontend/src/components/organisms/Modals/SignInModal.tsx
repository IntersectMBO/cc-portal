import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";

export const SignInModal = () => {
  const t = useTranslations("Modals");
  return (
    <ModalWrapper dataTestId="sign-in-modal" icon={IMAGES.pastelSignIn}>
      <ModalHeader>{t("signIn.headline")}</ModalHeader>
      <ModalContents>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "24px",
          }}
        >
          {t("signIn.description")}
        </Typography>
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
