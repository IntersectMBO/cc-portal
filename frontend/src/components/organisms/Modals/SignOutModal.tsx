import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { useAppContext, useModal } from "@context";
import { FormEvent } from "react";

export const SignOutModal = () => {
  const t = useTranslations("Modals");
  const { logout } = useAppContext();
  const { closeModal } = useModal();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    logout();
    closeModal();
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
