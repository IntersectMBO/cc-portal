"use client";
import { Typography } from "@mui/material";

import { useModal } from "@/context";
import { useSnackbar } from "@/context/snackbar";
import { toggleUserStatus } from "@/lib/api";
import { ModalActions, ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@consts";
import { isResponseErrorI } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { OpenSwitchStatusModalState } from "../types";

export const SwitchUsersStatus = () => {
  const t = useTranslations("Modals");
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const router = useRouter();

  const {
    closeModal,
    state: { newStatus, userId }
  } = useModal<OpenSwitchStatusModalState>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm();

  const onSubmit = async () => {
    const res = await toggleUserStatus(userId, newStatus);

    if (!isResponseErrorI(res)) {
      addSuccessAlert(t("switchUserStatus.alerts.success"));
      closeModal();
      router.refresh();
    } else {
      addErrorAlert(res.error);
    }
  };

  return (
    <ModalWrapper dataTestId="delete-user-modal" icon={IMAGES.pastelDeleteRole}>
      <ModalHeader>{t("switchUserStatus.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              marginBottom: "24px"
            }}
          >
            {t("switchUserStatus.description")}
          </Typography>
          <ControlledField.Input
            placeholder={t("switchUserStatus.fields.confirm.placeholder")}
            label={t("switchUserStatus.fields.confirm.label")}
            errors={errors}
            control={control}
            {...register("confirm", {
              required: "Please write CONFIRM",
              validate: (value) => value === "CONFIRM" || "Please write CONFIRM"
            })}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
