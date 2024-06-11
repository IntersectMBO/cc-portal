"use client";

import React, { useEffect, useState } from "react";
import { ModalWrapper, ModalHeader, Typography, Button } from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import { GovActionModalState } from "@organisms";
import { CopyCard, Loading } from "@molecules";
import { GovActionMetadata } from "../types";
import { getGovernanceMetadata } from "@/lib/api";

export const GovActionModal = () => {
  const t = useTranslations("Modals");
  const { closeModal, state } = useModal<GovActionModalState>();
  const [govAction, setGovAction] = useState<GovActionMetadata>();

  const onClick = () => {
    closeModal();
  };

  useEffect(() => {
    async function fetchVersions(id) {
      try {
        const meta = await getGovernanceMetadata(id);
        setGovAction(meta);
      } catch (error) {
        console.error("Error fetching gov action:", error);
      }
    }

    if (state.id) {
      fetchVersions(state.id);
    }
  }, [state.id]);

  return (
    <ModalWrapper dataTestId="governance-action-modal">
      {govAction ? (
        <>
          <ModalHeader sx={{ py: 1, mb: 0 }}>
            <Box>
              <img
                width={64}
                data-testid="modal-icon"
                alt="icon"
                src={IMAGES.pastelSignIn}
              />
            </Box>
            {govAction.title}
          </ModalHeader>
          <Box>
            <Typography
              variant="body2"
              fontWeight={400}
              sx={{ pb: 0 }}
              color={customPalette.textGray}
            >
              {govAction?.abstract}
            </Typography>
            <Box sx={{ py: 3 }}>
              <CopyCard
                title={t("govActionModal.govActionId")}
                copyText={state.id}
              />
            </Box>
            <Box>
              <Button onClick={onClick} variant="outlined" size="large">
                {t("common.close")}
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </ModalWrapper>
  );
};
