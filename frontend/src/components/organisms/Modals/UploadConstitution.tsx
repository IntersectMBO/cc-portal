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

export const UploadConstitution = () => {
  const t = useTranslations("Modals");

  const handleUpload = (file: File) => {
    console.log("uploaded file", file);
  };

  return (
    <ModalWrapper
      dataTestId="upload-constitution-modal"
      icon={IMAGES.pastelSignOut}
    >
      <ModalHeader>{t("uploadConstitution.headline")}</ModalHeader>
      <ModalContents>
        <Typography variant="body1" fontWeight={500}>
          {t("uploadConstitution.description")}
        </Typography>
        <UploadFileButton
          fullWidth={false}
          size="large"
          onChange={handleUpload}
        >
          {t("uploadConstitution.upload")}
        </UploadFileButton>

        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
