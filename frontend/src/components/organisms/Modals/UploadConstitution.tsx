"use client";

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
import { useForm } from "react-hook-form";
import { useState } from "react";
import { uploadConstitution } from "@/lib/api";

export const UploadConstitution = () => {
  const t = useTranslations("Modals");
  const [uploadFile, setUploadFile] = useState<File>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const handleUpload = (file: File) => {
    setUploadFile(file);
  };

  const onSubmit = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadConstitution(file);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalWrapper
      dataTestId="upload-constitution-modal"
      icon={IMAGES.pastelSignOut}
    >
      <ModalHeader>{t("uploadConstitution.headline")}</ModalHeader>
      <form
        onSubmit={() => {
          onSubmit(uploadFile);
        }}
      >
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
