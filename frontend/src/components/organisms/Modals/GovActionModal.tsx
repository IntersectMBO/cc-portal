"use client";

import React from "react";
import { ModalWrapper, ModalHeader, Typography, Button } from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import { GovActionModalState } from "@organisms";
import { CopyCard } from "@/components/molecules";

export const GovActionModal = () => {
  const t = useTranslations("Modals");
  const { closeModal, state } = useModal<GovActionModalState>();

  const onClick = () => {
    closeModal();
  };
  const description =
    "Lorem ipsum dolor sit amet consectetur. Velit placerat tincidunt eu odio mauris nibh quis morbi venenatis. Venenatis tincidunt mauris urna sagittis nulla eget.";

  return (
    <ModalWrapper dataTestId="governance-action-modal">
      <ModalHeader sx={{ py: 1, mb: 0 }}>
        <Box>
          <img
            width={64}
            data-testid="modal-icon"
            alt="icon"
            src={IMAGES.pastelSignIn}
          />
        </Box>
        {state.governance_proposal_title}
      </ModalHeader>
      <Box sx={{ pt: 1 }}>
        <Typography
          variant="body2"
          fontWeight={400}
          sx={{ pb: 2 }}
          color={customPalette.textGray}
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={400}
          color={customPalette.textGray}
        >
          {description}
        </Typography>
      </Box>

      <Box sx={{ py: 3 }}>
        <CopyCard title={t("govActionModal.govActionId")} copyText={state.id} />
      </Box>
      <Box>
        <Button onClick={onClick} variant="outlined" size="large">
          {t("common.close")}
        </Button>
      </Box>
    </ModalWrapper>
  );
};
