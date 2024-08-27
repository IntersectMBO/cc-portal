import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@/components/atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@/components/atoms";
import { Field } from "@/components/molecules";

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
        <Field.Input
          placeholder={t("deleteRole.fields.delete.placeholder")}
          label={t("deleteRole.fields.delete.label")}
          value=""
        />
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
