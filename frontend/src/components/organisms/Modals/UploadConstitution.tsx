import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
  UploadFileButton,
} from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";

export const UploadConstitution = () => {
  const t = useTranslations("Modals");

  const handleUpload = (file: File) => {
    console.log("uploaded file", file);
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <ModalWrapper
      dataTestId="upload-constitution-modal"
      icon={IMAGES.pastelSignOut}
    >
      <ModalHeader>{t("uploadConstitution.headline")}</ModalHeader>
      <form onSubmit={onSubmit}>
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

          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
