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
import { ControlledField } from "../ControlledField";

export const SignUpModal = () => {
  const t = useTranslations("Modals");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };
  const handleUpload = (file: File) => {
    console.log("uploaded file", file);
  };

  return (
    <ModalWrapper dataTestId="sign-up-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{t("signUp.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {t("signUp.description")}
          </Typography>

          <ControlledField.Input
            placeholder={t("signUp.fields.username.placeholder")}
            label={t("signUp.fields.username.label")}
            errors={errors}
            control={control}
            {...register("username", { required: "Username is required" })}
          />
          <ControlledField.Input
            placeholder={t("signUp.fields.hotAddress.placeholder")}
            label={t("signUp.fields.hotAddress.label")}
            errors={errors}
            control={control}
            {...register("hotAddress")}
          />
          <ControlledField.TextArea
            placeholder={t("signUp.fields.description.placeholder")}
            label={t("signUp.fields.description.label")}
            helpfulText={t("signUp.fields.description.helpfulText")}
            errors={errors}
            control={control}
            {...register("description")}
          />
          <UploadFileButton
            fullWidth={false}
            size="large"
            onChange={handleUpload}
          >
            {t("signUp.fields.upload")}
          </UploadFileButton>
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
