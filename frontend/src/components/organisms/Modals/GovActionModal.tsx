"use client";

import { useSnackbar } from "@/context/snackbar";
import { getGovernanceMetadata } from "@/lib/api";
import {
  Button,
  ModalHeader,
  ModalWrapper,
  OutlinedLightButton,
  Typography
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useModal } from "@context";
import { useScreenDimension } from "@hooks";
import { CopyCard, Loading } from "@molecules";
import { Box } from "@mui/material";
import { GovActionModalState } from "@organisms";
import {
  formatDisplayDate,
  getProposalTypeLabel,
  getShortenedGovActionId,
  isResponseErrorI
} from "@utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GovActionMetadata } from "../types";

export const GovActionModal = () => {
  const t = useTranslations("Modals");
  const { closeModal, state } = useModal<GovActionModalState>();
  const [govAction, setGovAction] = useState<GovActionMetadata>();
  const { addErrorAlert } = useSnackbar();
  const { isMobile } = useScreenDimension();

  const onClick = () => {
    closeModal();
  };

  useEffect(() => {
    async function fetchGAMetadata(id) {
      const meta = await getGovernanceMetadata(id);
      if (isResponseErrorI(meta)) {
        addErrorAlert(meta.error);
        closeModal();
      } else {
        setGovAction(meta);
      }
    }

    if (state.id) {
      fetchGAMetadata(state.id);
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
                width={isMobile ? 34 : 64}
                data-testid="modal-icon"
                alt="icon"
                src={IMAGES.pastelSignIn}
              />
            </Box>
            {govAction.title}
          </ModalHeader>
          <Box px={{ xxs: 2.25, md: 3 }}>
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
                copyText={getShortenedGovActionId(govAction.tx_hash, 10)}
                copyValue={govAction.tx_hash}
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
          <Box px={{ xxs: 2.25, md: 3 }} pt={2.5}>
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
