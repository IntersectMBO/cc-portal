import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";

export const DeleteRole = () => {
  const t = useTranslations("Modals");
  return (
    <ModalWrapper dataTestId="delete-role-modal" icon={IMAGES.pastelDeleteRole}>
      <ModalHeader>{t("deleteRole.headline")}</ModalHeader>
      <ModalContents>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "24px",
          }}
        >
          {t("deleteRole.description")}
        </Typography>
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
