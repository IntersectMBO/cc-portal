"use client";
import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { ControlledField } from "../ControlledField";
import { useForm } from "react-hook-form";

export const DeleteRole = () => {
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
    <ModalWrapper dataTestId="delete-role-modal" icon={IMAGES.pastelDeleteRole}>
      <ModalHeader>{t("deleteRole.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <ControlledField.Input
            placeholder={t("deleteRole.fields.delete.placeholder")}
            label={t("deleteRole.fields.delete.label")}
            errors={errors}
            control={control}
            {...register("delete", { required: "Please write DELETE" })}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
