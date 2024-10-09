"use client";
import { Typography } from "@mui/material";

import { useModal } from "@/context";
import { useSnackbar } from "@/context/snackbar";
import { deleteUser } from "@/lib/api";
import { ModalActions, ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@consts";
import { isResponseErrorI } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { OpenDeleteUserModalState } from "../types";

export const DeleteUser = () => {
  const t = useTranslations("Modals");
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const router = useRouter();

  const {
    closeModal,
    state: { sAdminId, userId }
  } = useModal<OpenDeleteUserModalState>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm();

  const onSubmit = async () => {
    const res = await deleteUser(sAdminId, userId);

    if (!isResponseErrorI(res)) {
      addSuccessAlert(t("deleteUser.alerts.success"));
      closeModal();
      router.refresh();
    } else {
      addErrorAlert(res.error);
    }
  };

  return (
    <ModalWrapper dataTestId="delete-user-modal" icon={IMAGES.pastelDeleteRole}>
      <ModalHeader>{t("deleteUser.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              marginBottom: "24px"
            }}
          >
            {t("deleteUser.description")}
          </Typography>
          <ControlledField.Input
            placeholder={t("deleteUser.fields.confirm.placeholder")}
            label={t("deleteUser.fields.confirm.label")}
            errors={errors}
            control={control}
            {...register("delete", {
              required: "Please write DELETE",
              validate: (value) => value === "DELETE" || "Please write DELETE"
            })}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
