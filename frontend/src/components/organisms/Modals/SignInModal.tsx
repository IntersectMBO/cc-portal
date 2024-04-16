import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";

export const SignInModal = () => {
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
