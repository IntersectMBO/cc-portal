import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";

export const SignOutModal = () => {
  const t = useTranslations("Modals");

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <ModalWrapper dataTestId="sign-out-modal" icon={IMAGES.pastelSignOut}>
      <ModalHeader>{t("signOut.headline")}</ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {t("signOut.description")}
          </Typography>
          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
