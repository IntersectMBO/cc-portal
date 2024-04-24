"use client";
import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { login } from "@/lib/api";
import { useModal } from "@context";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { useSnackbar } from "@/context/snackbar";

export const SignInModal = () => {
  const { closeModal } = useModal();
  const t = useTranslations("Modals");
  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email);
      closeModal();
      addSuccessAlert(t("signIn.alerts.success"));
    } catch (error) {
      addErrorAlert(t("signIn.alerts.error"));
    }
  };

  return (
    <ModalWrapper dataTestId="sign-in-modal" icon={IMAGES.pastelSignIn}>
      <ModalHeader>{t("signIn.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {t("signIn.description")}
          </Typography>

          <ControlledField.Input
            placeholder={t("signIn.fields.email.placeholder")}
            label={t("signIn.fields.email.label")}
            errors={errors}
            control={control}
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
