"use client";

import React, { useEffect, useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  Typography,
  Tooltip,
  Button,
  OutlinedLightButton,
  VotePill,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Reasoning } from "@/components/molecules/Reasoning";
import { OpenPreviewReasoningModal } from "../types";
import { getReasoningData } from "@/lib/api";
import {
  getProposalTypeLabel,
  getShortenedGovActionId,
  formatDisplayDate,
} from "@utils";
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
        console.error("Error fetching reasoning:", error);
      }
    }

    if (govAction?.id) {
      fetchData(govAction.id);
    }
  }, [govAction?.id]);

  const DisplayDate = ({
    bgColor = "#D6E2FF80",
    title,
    date,
    tooltipHeading,
    tooltipParagraph,
    dataTestId,
  }) => {
    return (
      <Box
        bgcolor={bgColor}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        py={0.75}
        data-testid={dataTestId}
      >
        <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
          {title}
        </Typography>
        <Typography
          fontWeight={600}
          sx={{ flexWrap: "nowrap" }}
          variant="caption"
        >
          {formatDisplayDate(date)}
        </Typography>
        <Tooltip
          heading={tooltipHeading}
          paragraphOne={tooltipParagraph}
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
    );
  };
  return (
    <ModalWrapper dataTestId="preview-reasoning-modal" sx={{ py: 3, px: 0 }}>
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
        {reasoning && (
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
        )}
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
        {govAction.vote && (
          <Box mt={3}>
            <Typography color="neutralGray" variant="caption">
              {t("previewReasoning.voted")}
            </Typography>
            <Box display="flex" mt={0.25}>
              <VotePill vote={govAction.vote} />
            </Box>
          </Box>
        )}
      </Box>
      {govAction.submit_time && (
        <DisplayDate
          date={govAction.submit_time}
          title={t("previewReasoning.submissionDate")}
          tooltipHeading={t("previewReasoning.tooltips.submissionDate.heading")}
          tooltipParagraph={t(
            "previewReasoning.tooltips.submissionDate.paragraphOne"
          )}
          dataTestId="submit-date"
        />
      )}
      {govAction.vote_submit_time && (
        <DisplayDate
          date={govAction.end_time}
          title={t("previewReasoning.voteSubmissionDate")}
          tooltipHeading={t(
            "previewReasoning.tooltips.submissionDate.vote.heading"
          )}
          tooltipParagraph={t(
            "previewReasoning.tooltips.submissionDate.vote.paragraphOne"
          )}
          dataTestId="vote-submit-date"
        />
      )}
      {govAction.end_time && (
        <DisplayDate
          date={govAction.end_time}
          title={t("previewReasoning.expiryDate")}
          tooltipHeading={t("previewReasoning.tooltips.expiryDate.heading")}
          tooltipParagraph={t(
            "previewReasoning.tooltips.expiryDate.paragraphTwo"
          )}
          dataTestId="expiry-date"
          bgColor="rgba(247, 249, 251, 1)"
        />
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
    </ModalWrapper>
  );
};
