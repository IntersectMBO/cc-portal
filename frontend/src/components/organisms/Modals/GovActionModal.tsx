"use client";

import React, { useEffect, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  Typography,
  Button,
  OutlinedLightButton,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import { GovActionModalState } from "@organisms";
import { CopyCard, Loading } from "@molecules";
import { GovActionMetadata } from "../types";
import { getGovernanceMetadata } from "@/lib/api";
import { formatDisplayDate, getProposalTypeLabel } from "@utils";

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
    <ModalWrapper
      scrollable
      sx={{ py: 3, px: 0 }}
      dataTestId="governance-action-modal"
    >
      {govAction ? (
        <>
          <ModalHeader sx={{ px: 3 }}>
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
          <Box px={{ xs: 2.25, md: 3 }}>
            <Typography
              variant="body2"
              fontWeight={400}
              sx={{ pb: 0 }}
              color={customPalette.textGray}
            >
              {govAction?.abstract}
            </Typography>
            <Box mt={3}>
              <CopyCard
                title={t("govActionModal.govActionId")}
                copyText={state.id}
              />
            </Box>
            <Box mt={3} data-testid="governance-action-type">
              <Typography color="neutralGray" variant="caption">
                {t("govActionModal.govActionCategory")}
              </Typography>
              <OutlinedLightButton nonInteractive={true}>
                {getProposalTypeLabel(govAction.type)}
              </OutlinedLightButton>
            </Box>
            <Box mt={3}>
              <Typography color="neutralGray" variant="caption">
                {t("govActionModal.gaStatus")}
              </Typography>
              <Box display="flex" mt={0.25}>
                <OutlinedLightButton nonInteractive>
                  {govAction.status}
                </OutlinedLightButton>
              </Box>
            </Box>
          </Box>
          <Box
            mt={3}
            bgcolor="#D6E2FF80"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            py={0.75}
          >
            <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
              {t("govActionModal.submitTime")}
            </Typography>
            <Typography
              fontWeight={600}
              sx={{ flexWrap: "nowrap" }}
              variant="caption"
            >
              {formatDisplayDate(govAction.submit_time)}
            </Typography>
          </Box>
          {govAction.end_time && (
            <Box
              data-testid="expiry-date"
              bgcolor="rgba(247, 249, 251, 1)"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              py={0.75}
            >
              <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
                {t("govActionModal.endTime")}
              </Typography>
              <Typography
                fontWeight={600}
                sx={{ flexWrap: "nowrap" }}
                variant="caption"
              >
                {formatDisplayDate(govAction.end_time)}
              </Typography>
            </Box>
          )}
          <Box px={{ xs: 2.25, md: 3 }} pt={2.5}>
            <Button onClick={onClick} variant="outlined" size="large">
              {t("common.close")}
            </Button>
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </ModalWrapper>
  );
};
