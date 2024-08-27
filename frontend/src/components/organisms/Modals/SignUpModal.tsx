import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
  UploadFileButton,
} from "@/components/atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@/components/atoms";
import { Field } from "@molecules";

export const SignUpModal = () => {
  const t = useTranslations("Modals");

  const handleUpload = (file: File) => {
    console.log("uploaded file", file);
  };

  return (
    <ModalWrapper dataTestId="sign-up-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{t("signUp.headline")}</ModalHeader>
      <ModalContents>
        <Typography variant="body1" fontWeight={500}>
          {t("signUp.description")}
        </Typography>

        <Field.Input
          placeholder={t("signUp.fields.username.placeholder")}
          label={t("signUp.fields.username.label")}
          value=""
        />
        <Field.Input
          placeholder={t("signUp.fields.hotAddress.placeholder")}
          label={t("signUp.fields.hotAddress.label")}
          value=""
        />
        <Field.TextArea
          placeholder={t("signUp.fields.description.placeholder")}
          label={t("signUp.fields.description.label")}
          helpfulText={t("signUp.fields.description.helpfulText")}
          value=""
        />
        <UploadFileButton
          fullWidth={false}
          size="large"
          onChange={handleUpload}
        >
          {t("signUp.fields.upload")}
        </UploadFileButton>
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
