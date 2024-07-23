"use client";

import React from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContents,
  Typography,
  Button,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { CopyCard } from "@molecules";
import { OpenReasoningLinkModalState } from "../types";
import {
  truncateText,
  getShortenedGovActionId,
  useScreenDimension,
} from "@utils";
import { Box } from "@mui/material";

export const ReasoningLinkModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { hash, link },
  } = useModal<OpenReasoningLinkModalState>();
  const { isMobile } = useScreenDimension();

  return (
    <ModalWrapper
      dataTestId="reasoning-link-modal"
      icon={IMAGES.pastelReasoning}
    >
      <ModalHeader sx={{ marginTop: "16px" }}>
        {t("reasoningLink.headline")}
      </ModalHeader>

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
          copyValue={hash}
          copyText={getShortenedGovActionId(hash, isMobile ? 4 : 20)}
        />
        <CopyCard
          title={t("reasoningLink.reasoningLink")}
          copyValue={link}
          copyText={truncateText(link, isMobile ? 20 : 50)}
        />
        <Box>
          <Button onClick={closeModal} variant="outlined" size="large">
            {t("common.close")}
          </Button>
        </Box>
      </ModalContents>
    </ModalWrapper>
  );
};
