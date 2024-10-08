"use client";
import { Typography } from "@mui/material";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { ControlledField } from "../ControlledField";
import { useForm } from "react-hook-form";
import { useModal } from "@/context";
import { OpenDeleteRoleModalState } from "../types";
import { useSnackbar } from "@/context/snackbar";
import { toggleUserStatus } from "@/lib/api";
import { isResponseErrorI } from "@utils";
import { useRouter } from "next/navigation";

export const DeleteRole = () => {
  const t = useTranslations("Modals");
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const router = useRouter();

  const {
    closeModal,
    state: { userId, status },
  } = useModal<OpenDeleteRoleModalState>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async () => {
    const res = await toggleUserStatus(userId, status);

    if (!isResponseErrorI(res)) {
      addSuccessAlert(t("deleteRole.alerts.success"));
      closeModal();
      router.refresh();
    } else {
      addErrorAlert(res.error);
    }
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
            placeholder={t("deleteRole.fields.confirm.placeholder")}
            label={t("deleteRole.fields.confirm.label")}
            errors={errors}
            control={control}
            {...register("confirm", {
              required: "Please write CONFIRM",
              validate: (value) =>
                value === "CONFIRM" || "Please write CONFIRM",
            })}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
