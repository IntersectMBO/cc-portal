"use client";

import React, { useEffect, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  Typography,
  Tooltip,
  Button,
  VotePill,
  OutlinedLightButton,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tabs } from "@organisms";
import { Reasoning } from "@/components/molecules/Reasoning";
import {
  OpenPreviewReasoningModal,
  PreviewReasoningModalState,
} from "../types";
import { getReasoningData } from "@/lib/api";
import { Loading } from "@/components/molecules";
import {
  getProposalTypeLabel,
  getShortenedGovActionId,
  formatDisplayDate,
} from "@utils";
import { useSnackbar } from "@/context/snackbar";

export const PreviewReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { id, onActionClick, actionTitle },
  } = useModal<OpenPreviewReasoningModal>();
  const { addErrorAlert } = useSnackbar();
  const [reasoning, setReasoning] = useState<PreviewReasoningModalState | null>(
    null
  );

  const onClose = () => {
    closeModal();
  };

  useEffect(() => {
    async function fetchData(id: string) {
      try {
        const response = await getReasoningData(id);
        setReasoning(response);
      } catch (error) {
        addErrorAlert(t("previewReasoning.alerts.errorFetchingData"));
        closeModal();
        console.error("Error fetching reasoning:", error);
      }
    }

    if (id) {
      fetchData(id);
    }
  }, [id]);

  return (
    <ModalWrapper dataTestId="preview-reasoning-modal" sx={{ padding: 0 }}>
      {reasoning ? (
        <>
          <ModalHeader sx={{ px: 3, py: 1, mb: 0 }}>
            <Box>
              <img
                width={64}
                data-testid="modal-icon"
                alt="icon"
                src={IMAGES.pastelAddMember}
              />
            </Box>
            {t("previewReasoning.headline")}
          </ModalHeader>
          <Typography
            sx={{ px: 3 }}
            variant="body2"
            fontWeight={400}
            color={customPalette.textGray}
          >
            {t("previewReasoning.description")}
          </Typography>

          <Box
            sx={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
            pt={1.5}
            pb={3}
            px={{ xs: 2.25, md: 3 }}
          >
            <Box
              padding={1.5}
              border={1}
              borderColor={customPalette.lightBlue}
              borderRadius="16px"
              display="flex"
            >
              <Reasoning
                title={reasoning.title}
                description={reasoning.description}
                link={reasoning?.link}
                hash={reasoning?.hash}
              />
            </Box>
            <Box mt={3}>
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.governanceActionId")}
              </Typography>
              <OutlinedLightButton nonInteractive={true}>
                {getShortenedGovActionId(reasoning.gov_action_proposal_id)}
              </OutlinedLightButton>
            </Box>
            <Box mt={3} data-testid="governance-action-type">
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.governanceActionCategory")}
              </Typography>
              <OutlinedLightButton nonInteractive={true}>
                {getProposalTypeLabel(reasoning.gov_action_proposal_type)}
              </OutlinedLightButton>
            </Box>
            <Box mt={3}>
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.voted")}
              </Typography>
              <Box display="flex" mt={0.25}>
                <VotePill vote={reasoning.vote} />
              </Box>
            </Box>
          </Box>

          <Box
            bgcolor="#D6E2FF80"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            py={0.75}
          >
            <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
              {t("previewReasoning.submissionDate")}
            </Typography>
            <Typography
              fontWeight={600}
              sx={{ flexWrap: "nowrap" }}
              variant="caption"
            >
              {formatDisplayDate(reasoning.submission_date)}
            </Typography>
            <Tooltip
              heading={t("previewReasoning.tooltips.submissionDate.heading")}
              paragraphOne={t(
                "previewReasoning.tooltips.submissionDate.paragraphOne"
              )}
              placement="bottom-end"
              arrow
            >
              <InfoOutlinedIcon
                style={{
                  color: "#ADAEAD",
                }}
                sx={{ ml: 0.7 }}
                fontSize="small"
              />
            </Tooltip>
          </Box>

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
              {t("previewReasoning.expiryDate")}
            </Typography>
            <Typography
              fontWeight={600}
              sx={{ flexWrap: "nowrap" }}
              variant="caption"
            >
              {formatDisplayDate(reasoning.expiry_date)}
            </Typography>
            <Tooltip
              heading={t("previewReasoning.tooltips.expiryDate.heading")}
              paragraphOne={t(
                "previewReasoning.tooltips.expiryDate.paragraphOne"
              )}
              paragraphTwo={t(
                "previewReasoning.tooltips.expiryDate.paragraphTwo"
              )}
              placement="bottom-end"
              arrow
            >
              <InfoOutlinedIcon
                style={{
                  color: "#ADAEAD",
                }}
                sx={{ ml: 0.7 }}
                fontSize="small"
              />
            </Tooltip>
          </Box>

          <Box
            bgcolor="white"
            px={{ xs: 1.4, md: 3 }}
            py={2.5}
            sx={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          >
            {onActionClick && (
              <Button
                onClick={() => onActionClick(id)}
                variant="contained"
                size="large"
                sx={{
                  width: "100%",
                  marginBottom: 1.5,
                }}
              >
                {actionTitle}
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="contained"
              size="large"
              sx={{
                width: "100%",
              }}
            >
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
