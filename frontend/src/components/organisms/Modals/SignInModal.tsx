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
import { isResponseErrorI } from "@utils";

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
    const res = await login(data.email);
    if (isResponseErrorI(res)) {
      addErrorAlert(res.error);
    } else {
      closeModal();
      addSuccessAlert(t("signIn.alerts.success"));
    }
  };

  return (
    <ModalWrapper dataTestId="sign-in-modal" icon={IMAGES.pastelSignIn}>
      <ModalHeader>
        // todo: check this with kiki
        <span data-testid="sign-in-modal-title-text">
          {t("signIn.headline")}
        </span>
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography
            variant="body1"
            fontWeight={500}
            data-testid="sing-in-modal-desciption-text"
          >
            {t("signIn.description")}
          </Typography>

          <ControlledField.Input
            label={t("signIn.fields.email.label")}
            errors={errors}
            control={control}
            type="email"
            {...register("email", { required: "Email is required" })}
            data-testid="sign-in-modal-input-field"
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
