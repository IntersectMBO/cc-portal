"use client";

import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES, PATHS } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { useModal } from "@context";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SignOutModalState } from "../types";

export const SignOutModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { homeRedirectionPath },
  } = useModal<SignOutModalState>();
  const router = useRouter();
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    closeModal();
    router.refresh();
    router.push(`${PATHS.logout}?redirectURL=${homeRedirectionPath}`);
  };

  return (
    <ModalWrapper dataTestId="sign-out-modal" icon={IMAGES.pastelSignOut}>
      <ModalHeader>
        <span data-testid="sing-out-modal-title-text">
          {t("signOut.headline")}
        </span>
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalContents>
          <Typography
            variant="body1"
            fontWeight={500}
            data-testid="sing-out-modal-desciption-text"
          >
            {t("signOut.description")}
          </Typography>
          <ModalActions dataTestId="sign-out-modal" />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
