"use client";

import React, { useEffect, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  Typography,
  Tooltip,
  Button,
  OutlinedLightButton,
  GovActionStatusPill,
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
import { ReasoningContentsI, ReasoningResponseI } from "@/lib/requests";

interface Reasoning extends Omit<ReasoningResponseI, "contents"> {
  contents: ReasoningContentsI;
}
export const PreviewReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { govAction, onActionClick, actionTitle },
  } = useModal<OpenPreviewReasoningModal>();
  const { addErrorAlert } = useSnackbar();
  const [reasoning, setReasoning] = useState<Reasoning | null>(null);
  const onClose = () => {
    closeModal();
  };

  useEffect(() => {
    async function fetchData(id: string) {
      try {
        const response = await getReasoningData(id);
        setReasoning({ ...response, contents: JSON.parse(response.contents) });
      } catch (error) {
        addErrorAlert(t("previewReasoning.alerts.errorFetchingData"));
        closeModal();
        console.error("Error fetching reasoning:", error);
      }
    }

    if (govAction?.id) {
      fetchData(govAction.id);
    }
  }, [govAction?.id]);

  return (
    <ModalWrapper dataTestId="preview-reasoning-modal" sx={{ py: 3, px: 0 }}>
      {reasoning ? (
        <>
          <ModalHeader sx={{ px: 3 }}>
            <Box sx={{ mb: 2, height: "64px" }}>
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
            pt={3}
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
                title={reasoning.contents.title}
                description={reasoning.contents.content}
                link={reasoning.url}
                hash={reasoning.blake2b}
              />
            </Box>
            <Box mt={3}>
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.governanceActionId")}
              </Typography>
              <OutlinedLightButton nonInteractive={true}>
                {getShortenedGovActionId(govAction.id)}
              </OutlinedLightButton>
            </Box>
            <Box mt={3} data-testid="governance-action-type">
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.governanceActionCategory")}
              </Typography>
              <OutlinedLightButton nonInteractive={true}>
                {getProposalTypeLabel(govAction.type)}
              </OutlinedLightButton>
            </Box>
            <Box mt={3}>
              <Typography color="neutralGray" variant="caption">
                {t("previewReasoning.voted")}
              </Typography>
              <Box display="flex" mt={0.25}>
                <GovActionStatusPill status={govAction.vote_status} />
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
              {formatDisplayDate(govAction.submit_time)}
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
                {t("previewReasoning.expiryDate")}
              </Typography>
              <Typography
                fontWeight={600}
                sx={{ flexWrap: "nowrap" }}
                variant="caption"
              >
                {formatDisplayDate(govAction.end_time)}
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
          )}

          <Box
            bgcolor="white"
            px={{ xs: 1.4, md: 3 }}
            pt={2.5}
            sx={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
          >
            {onActionClick && (
              <Button
                onClick={() => onActionClick(govAction.id)}
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
