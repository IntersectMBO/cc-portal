"use client";

import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { useAppContext, useModal } from "@context";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignOutModalState } from "../types";

export const SignOutModal = () => {
  const t = useTranslations("Modals");
  const { logout, user } = useAppContext();
  const {
    closeModal,
    state: { homeRedirectionPath },
  } = useModal<SignOutModalState>();
  const router = useRouter();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    closeModal();
    logout(homeRedirectionPath);
    router.refresh();
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
