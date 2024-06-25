"use client";
import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { ControlledField } from "../ControlledField";
import { useForm } from "react-hook-form";
import { createFormDataObject } from "@utils";
import { useSnackbar } from "@/context/snackbar";
import { uploadConstitution } from "@/lib/api";
import { useModal } from "@context";
import { useState } from "react";

export const UploadConstitution = () => {
  const { closeModal } = useModal();
  const t = useTranslations("Modals");
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = createFormDataObject(data);
      await uploadConstitution(formData);
      addSuccessAlert(t("uploadConstitution.alerts.success"));
      closeModal();
    } catch (error) {
      addErrorAlert(
        error.message ? error.message : t("uploadConstitution.alerts.error")
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <ModalWrapper
      dataTestId="upload-constitution-modal"
      icon={IMAGES.pastelSignOut}
    >
      <ModalHeader>{t("uploadConstitution.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {t("uploadConstitution.description")}
          </Typography>
          <ControlledField.Upload
            fullWidth={false}
            control={control}
            size="large"
            errors={errors}
            accept=".md"
            {...register("file", {
              required: "Required",
              validate: {
                isMDFile: (value) =>
                  value.name.endsWith(".md") || "Only .md files are allowed",
              },
            })}
          >
            {t("uploadConstitution.upload")}
          </ControlledField.Upload>
          <ModalActions isSubmitting={isSubmitting} />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
