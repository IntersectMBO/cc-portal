"use client";

import React from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContents,
  ModalActions,
  Typography,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { useSnackbar } from "@/context/snackbar";
import { CopyCard } from "@molecules";

export const ReasoningLinkModal = () => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  const onSubmit = () => {
    try {
      addSuccessAlert(t("reasoningLink.alerts.success"));
      closeModal();
    } catch (error) {
      addErrorAlert(t("reasoningLink.alerts.error"));
    }
  };

  return (
    <ModalWrapper
      dataTestId="reasoning-link-modal"
      icon={IMAGES.pastelReasoning}
    >
      <ModalHeader sx={{ marginTop: "16px" }}>
        {t("reasoningLink.headline")}
      </ModalHeader>
      <form onSubmit={onSubmit}>
        <ModalContents>
          <Typography
            color={customPalette.textGray}
            variant="body2"
            fontWeight={400}
          >
            {t("reasoningLink.description")}
          </Typography>

          <CopyCard
            title={t("reasoningLink.hash")}
            copyText="324rfwdf123abcdH76ADF8utkm"
          />
          <CopyCard
            title={t("reasoningLink.reasoningLink")}
            copyText="djfs.fems.com"
          />

          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
