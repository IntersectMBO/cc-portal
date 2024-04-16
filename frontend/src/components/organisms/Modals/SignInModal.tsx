import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { Field } from "@molecules";
import { login } from "@/lib/api";
import { useModal } from "@/context";

export const SignInModal = () => {
  const { closeModal } = useModal();
  const t = useTranslations("Modals");

  const handleSubmit = async (formData: FormData) => {
    try {
      const email = formData.get("email");
      await login(email);
      closeModal();
    } catch (error) {}
  };

  return (
    <ModalWrapper dataTestId="sign-in-modal" icon={IMAGES.pastelSignIn}>
      <ModalHeader>{t("signIn.headline")}</ModalHeader>
      <form action={handleSubmit}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {t("signIn.description")}
          </Typography>

          <Field.Input
            name="email"
            type="email"
            required
            placeholder={t("signIn.fields.email.placeholder")}
            label={t("signIn.fields.email.label")}
          />
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
