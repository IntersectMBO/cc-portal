"use client";

import { CopyPill } from "@/components/molecules";
import { useSnackbar } from "@/context/snackbar";
import { getGovernanceMetadata } from "@/lib/api";
import {
  Button,
  ModalHeader,
  ModalWrapper,
  OutlinedLightButton,
  Typography,
  VotePill
} from "@atoms";
import { IMAGES } from "@consts";
import { useModal } from "@context";
import { useScreenDimension } from "@hooks";
import { Box } from "@mui/material";
import {
  changeVotingLabels,
  formatDisplayDate,
  getProposalTypeLabel,
  getShortenedGovActionId,
  isResponseErrorI
} from "@utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GovActionMetadata, OpenPreviewReasoningModal } from "../types";

export const PreviewReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { govAction, onActionClick, actionTitle }
  } = useModal<OpenPreviewReasoningModal>();
  const onClose = () => {
    closeModal();
  };
  const { isMobile } = useScreenDimension();
  const { addErrorAlert } = useSnackbar();
  const [govMetadata, setGovMetadata] = useState<GovActionMetadata>();
  const updatedVoteLabel = changeVotingLabels(govAction.vote);

  useEffect(() => {
    async function fetchGAMetadata(id) {
      const meta = await getGovernanceMetadata(id);
      if (isResponseErrorI(meta)) {
        addErrorAlert(meta.error);
        closeModal();
      } else {
        setGovMetadata(meta);
      }
    }

    if (govAction.id) {
      fetchGAMetadata(govAction.id);
    }
  }, [govAction.id]);

  if (!govMetadata) return null;
  return (
    <ModalWrapper dataTestId="preview-reasoning-modal" sx={{ py: 3, px: 0 }}>
      <ModalHeader sx={{ px: 3 }}>
        <Box sx={{ mb: { xxs: 0, md: 2 }, height: "64px" }}>
          <img
            width={isMobile ? 34 : 64}
            data-testid="modal-icon"
            alt="icon"
            src={IMAGES.pastelAddMember}
          />
        </Box>
        <span data-testid="governance-action-modal-title-text">
          {govAction.title}
        </span>
      </ModalHeader>
      <Box
        sx={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)"
        }}
        pt={2}
        pb={2}
        px={{ xxs: 2.25, md: 3 }}
      >
        <Box
          display="flex"
          flexDirection={{ xxs: "column", md: "row" }}
          gap={isMobile ? 2 : 5}
        >
          {govAction.vote && (
            <Box>
              <Typography color="neutralGray" variant="caption">
                {t("previewRationale.voted")}
              </Typography>
              <Box display="flex" mt={0.25}>
                <VotePill vote={updatedVoteLabel} />
              </Box>
            </Box>
          )}
          <Box>
            <Typography color="neutralGray" variant="caption">
              {t("previewRationale.rationale")}
            </Typography>
            {govAction.rationale_url ? (
              <Box display="flex" mt={0.25}>
                <OutlinedLightButton
                  onClick={() => window.open(govAction.rationale_url, "_blank")}
                >
                  {getShortenedGovActionId(
                    govAction.rationale_url,
                    isMobile ? 4 : 20
                  )}
                </OutlinedLightButton>
              </Box>
            ) : (
              <Box display="flex" mt={0.25}>
                <OutlinedLightButton sx={{ minHeight: "30px" }} nonInteractive>
                  {t("previewRationale.notAvailable")}
                </OutlinedLightButton>
              </Box>
            )}
          </Box>
        </Box>
        <Box mt={3}>
          <Typography color="neutralGray" variant="caption">
            {t("previewRationale.governanceActionAbstract")}
          </Typography>
          <Box display="flex" mt={0.25}>
            <Typography
              variant="body2"
              fontWeight={400}
              sx={{ pb: 0 }}
              data-testid="governance-action-modal-abstract-text"
            >
              {govMetadata.abstract}
            </Typography>
          </Box>
        </Box>
        <Box mt={3}>
          <Typography color="neutralGray" variant="caption">
            {t("previewRationale.governanceActionId")}
          </Typography>
          <CopyPill
            copyValue={govAction.tx_hash}
            copyText={getShortenedGovActionId(
              govAction.tx_hash,
              isMobile ? 4 : 20
            )}
          />
        </Box>

        <Box mt={3} data-testid="governance-action-type-text">
          <Typography color="neutralGray" variant="caption">
            {t("previewRationale.governanceActionCategory")}
          </Typography>
          <OutlinedLightButton
            nonInteractive={true}
            data-testid="rationale-modal-ga-category-text"
          >
            {getProposalTypeLabel(govAction.type)}
          </OutlinedLightButton>
        </Box>
        <Box mt={3} data-testid="governance-action-status">
          <Typography color="neutralGray" variant="caption">
            {t("previewRationale.governanceActionStatus")}
          </Typography>
          <Box display="flex" mt={0.25}>
            <OutlinedLightButton
              nonInteractive
              data-testid="governance-action-modal-status-text"
            >
              {govAction.status}
            </OutlinedLightButton>
          </Box>
        </Box>
      </Box>

      {govMetadata.submit_time && (
        <Box
          data-testid="governance-action-modal-submit-date"
          bgcolor="#D6E2FF80"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          py={0.75}
        >
          <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
            {t("previewRationale.submissionDate")}
          </Typography>
          <Typography
            fontWeight={600}
            sx={{ flexWrap: "nowrap" }}
            variant="caption"
            data-testid="governance-action-modal-submit-time"
          >
            {formatDisplayDate(govMetadata.submit_time)}
          </Typography>
        </Box>
      )}
      {govMetadata?.end_time && (
        <Box
          data-testid="governance-action-modal-expiry-date"
          bgcolor="rgba(247, 249, 251, 1)"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          py={0.75}
        >
          <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
            {t("previewRationale.expiryDate")}
          </Typography>
          <Typography
            fontWeight={600}
            sx={{ flexWrap: "nowrap" }}
            variant="caption"
            data-testid="governance-action-modal-end-time"
          >
            {formatDisplayDate(govMetadata.end_time)}
          </Typography>
        </Box>
      )}
      <Box px={{ xxs: 1.4, md: 3 }} pt={2.5} display="flex" gap={2}>
        {onActionClick && (
          <Button
            onClick={() => onActionClick(govAction.id)}
            variant="contained"
            sx={{ marginBottom: 1.5 }}
            data-testid="rationale-modal-action-button"
          >
            {actionTitle}
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ width: !onActionClick ? "100%" : undefined }}
          data-testid="rationale-modal-close-button"
        >
          {t("common.close")}
        </Button>
      </Box>
    </ModalWrapper>
  );
};
