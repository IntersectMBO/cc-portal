import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
} from "@/components/atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@/components/atoms";
import { Field } from "@molecules";

export const SignInModal = () => {
  const t = useTranslations("Modals");
  return (
    <ModalWrapper dataTestId="sign-in-modal" icon={IMAGES.pastelSignIn}>
      <ModalHeader>{t("signIn.headline")}</ModalHeader>
      <ModalContents>
        <Typography variant="body1" fontWeight={500}>
          {t("signIn.description")}
        </Typography>

        <Field.Input
          placeholder={t("signIn.fields.email.placeholder")}
          label={t("signIn.fields.email.label")}
          value=""
        />
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
