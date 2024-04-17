"use client";
import { useModal } from "@context";
import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
  Button,
  ModalActions,
} from "@atoms";
import { IMAGES } from "@consts";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { SignupModalState } from "../types";

export const SignUpModal = () => {
  const { state } = useModal<SignupModalState>();
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

          <ControlledField.Upload
            fullWidth={false}
            size="large"
            errors={errors}
            control={control}
            {...register("file")}
          >
            {t("signUp.fields.upload")}
          </ControlledField.Upload>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {state.showCloseButton ? (
              <ModalActions />
            ) : (
              <Button type="submit">{t("common.confirm")}</Button>
            )}
          </Box>
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
