"use client";

import { CopyPill } from "@/components/molecules";
import { Reasoning } from "@/components/molecules/Reasoning";
import { useSnackbar } from "@/context/snackbar";
import { ReasoningResponseI } from "@/lib/requests";
import {
  Button,
  ModalHeader,
  ModalWrapper,
  OutlinedLightButton,
  Tooltip,
  Typography,
  VotePill
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useModal } from "@context";
import { useScreenDimension } from "@hooks";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box } from "@mui/material";
import {
  formatDisplayDate,
  getProposalTypeLabel,
  getShortenedGovActionId
} from "@utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { OpenPreviewReasoningModal } from "../types";

interface Reasoning extends Omit<ReasoningResponseI, "contents"> {
  comment: string;
}
export const PreviewReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    closeModal,
    state: { govAction, onActionClick, actionTitle }
  } = useModal<OpenPreviewReasoningModal>();
  const [reasoning, setReasoning] = useState<Reasoning | null>(null);
  const onClose = () => {
    closeModal();
  };
  const { isMobile } = useScreenDimension();
  const { addErrorAlert } = useSnackbar();

  useEffect(() => {
    // async function fetchData(id: string) {
    //   const response = await getReasoningData(id);
    //   if (isResponseErrorI(response)) {
    //     if (response.statusCode !== 404 && response.statusCode !== 401) {
    //       addErrorAlert(response.error);
    //       closeModal();
    //     }
    //   } else {
    //     const contents = JSON.parse(response.contents);
    //     setReasoning({ ...response, comment: contents.body.comment });
    //   }
    // }
    // if (govAction.reasoning_title && govAction.reasoning_comment) {
    //   setReasoning({
    //     comment: govAction.reasoning_comment,
    //     title: govAction.reasoning_title,
    //   });
    // } else if (govAction?.id) {
    //   fetchData(govAction.id);
    // }
  }, [govAction?.id]);

  const DisplayDate = ({
    bgColor = "#D6E2FF80",
    title,
    date,
    tooltipHeading,
    tooltipParagraph,
    dataTestId
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
              color: "#ADAEAD"
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
        <Box sx={{ mb: { xxs: 0, md: 2 }, height: "64px" }}>
          <img
            width={isMobile ? 34 : 64}
            data-testid="modal-icon"
            alt="icon"
            src={IMAGES.pastelAddMember}
          />
        </Box>
        <span data-testid="rationale-modal-title-text">
          {t("previewRationale.headline")}
        </span>
      </ModalHeader>
      {!govAction.rationale_url && (
        <Typography
          sx={{ px: 3 }}
          variant="body2"
          fontWeight={400}
          color={customPalette.textGray}
          data-testid="rationale-modal-description-text"
        >
          {t("previewRationale.noRationaleUrl")}
        </Typography>
      )}
      <Box
        sx={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)"
        }}
        pt={3}
        pb={3}
        px={{ xxs: 2.25, md: 3 }}
      >
        {/* {reasoning && (
          <Box
            padding={1.5}
            border={1}
            borderColor={customPalette.lightBlue}
            borderRadius="16px"
            display="flex"
          >
            <Reasoning
              title={reasoning.title}
              description={reasoning.comment}
              link={reasoning.url}
              hash={reasoning.blake2b}
              data-testid="asdf"
            />
          </Box>
        )} */}
        {govAction.rationale_url && (
          <Box mt={3}>
            <Typography color="neutralGray" variant="caption">
              {t("previewRationale.rationaleLink")}
            </Typography>
            <CopyPill
              copyValue={govAction.rationale_url}
              copyText={getShortenedGovActionId(
                govAction.rationale_url,
                isMobile ? 4 : 20
              )}r
            />
          </Box>
        )}
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
        {govAction.vote && (
          <Box mt={3}>
            <Typography color="neutralGray" variant="caption">
              {t("previewRationale.voted")}
            </Typography>
            <Box
              display="flex"
              mt={0.25}
              data-testid={`rationale-modal-vote-text`}
            >
              <VotePill vote={govAction.vote} />
            </Box>
          </Box>
        )}
      </Box>
      {govAction.submit_time && (
        <DisplayDate
          date={govAction.submit_time}
          title={t("previewRationale.submissionDate")}
          tooltipHeading={t("previewRationale.tooltips.submissionDate.heading")}
          tooltipParagraph={t(
            "previewRationale.tooltips.submissionDate.paragraphOne"
          )}
          dataTestId="submit-date-row"
        />
      )}
      {govAction.vote_submit_time && (
        <DisplayDate
          date={govAction.end_time}
          title={t("previewRationale.voteSubmissionDate")}
          tooltipHeading={t(
            "previewRationale.tooltips.submissionDate.vote.heading"
          )}
          tooltipParagraph={t(
            "previewRationale.tooltips.submissionDate.vote.paragraphOne"
          )}
          dataTestId="vote-submit-date-row"
        />
      )}
      {govAction.end_time && (
        <DisplayDate
          date={govAction.end_time}
          title={t("previewRationale.expiryDate")}
          tooltipHeading={t("previewRationale.tooltips.expiryDate.heading")}
          tooltipParagraph={t(
            "previewRationale.tooltips.expiryDate.paragraphTwo"
          )}
          bgColor="rgba(247, 249, 251, 1)"
          dataTestId="expiry-date-row"
        />
      )}

      <Box
        bgcolor="white"
        px={{ xxs: 1.4, md: 3 }}
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
              marginBottom: 1.5
            }}
            data-testid="rationale-modal-action-button"
          >
            {actionTitle}
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            width: "100%"
          }}
          data-testid="rationale-modal-close-button"
        >
          {t("common.close")}
        </Button>
      </Box>
    </ModalWrapper>
  );
};
