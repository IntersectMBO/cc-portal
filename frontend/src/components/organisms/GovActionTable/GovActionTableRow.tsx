"use client";

import { GovernanceActionTableI, ReasoningResponseI } from "@/lib/requests";
import {
  Button,
  GovActionStatusPill,
  OutlinedLightButton,
  Typography,
} from "@atoms";
import { customPalette, ICONS, PATHS } from "@consts";
import { useModal } from "@context";
import { Card, CopyPill, TableDivider, UserAvatar } from "@molecules";
import { Box, Grid } from "@mui/material";
import { getProposalTypeLabel, getShortenedGovActionId } from "@utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GovActionModalState,
  OpenAddReasoningModalState,
  OpenPreviewReasoningModal,
  OpenReasoningLinkModalState,
} from "../types";

interface Props {
  govActions: GovernanceActionTableI;
}

export const GovActionTableRow = ({ govActions }: Props) => {
  const t = useTranslations("GovernanceActions");
  const { id, vote_status, status, title, type, has_reasoning, tx_hash } =
    govActions;
  const govActionModal = useModal<GovActionModalState>();
  const addReasoningModal = useModal<OpenAddReasoningModalState>();
  const reasoningLinkModal = useModal<OpenReasoningLinkModalState>();
  const updateReasoningModal = useModal<OpenPreviewReasoningModal>();
  const isDisabled = status.toLowerCase() !== "active";
  const isUnvoted = vote_status.toLowerCase() === "unvoted";
  const router = useRouter();
  //User can add reasoning in two cases:
  // 1. User doesn't have vote for selected GA
  // 2. User has vote for selected GA, but doesn't have reasoning
  const canAddReasoning =
    isUnvoted || (!has_reasoning && vote_status.toLowerCase() === "voted");

  const openGAModal = () => {
    govActionModal.openModal({
      type: "govActionModal",
      state: {
        id,
      },
    });
  };
  const openUpdateReasoningCallback = () => {
    updateReasoningModal.closeModal();
    openAddReasoningModal();
  };
  const openUpdateReasoningModal = () => {
    updateReasoningModal.openModal({
      type: "previewReasoningModal",
      state: {
        govAction: govActions,
        actionTitle: t("updateRationale"),
        onActionClick: openUpdateReasoningCallback,
      },
    });
  };

  const openReasoningLinkModal = (hash: string, link: string) => {
    reasoningLinkModal.openModal({
      type: "reasoningLinkModal",
      state: {
        hash,
        link,
      },
    });
  };

  const addReasoningCallback = (response: ReasoningResponseI) => {
    addReasoningModal.closeModal();
    router.push(`${PATHS.governanceActions}?page=1`);
    openReasoningLinkModal(response.blake2b, response.url);
  };

  const openAddReasoningModal = () => {
    addReasoningModal.openModal({
      type: "addReasoningModal",
      state: {
        id,
        callback: (response: ReasoningResponseI) =>
          addReasoningCallback(response),
      },
    });
  };

  return (
    <Grid
      item
      mb={3}
      sx={{
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <Card variant="default">
        <Grid container>
          <Grid
            item
            xxs={12}
            display="flex"
            rowGap={2}
            flexDirection={{
              xxs: "column",
              md: "row",
              lg: "row",
              xl: "row",
            }}
          >
            <Grid
              item
              xxs="auto"
              md={6}
              lg={3}
              xl={3}
              m={{ md: "auto", lg: "auto" }}
            >
              <Grid container flexWrap="nowrap">
                <Grid item>
                  <UserAvatar src={ICONS.govAction} />
                </Grid>
                <Grid
                  item
                  px={{ xxs: 0, lg: 1, xl: 3 }}
                  py={{ xxs: 1.5, lg: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 0.5 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("govAction")}
                  </Typography>

                  <OutlinedLightButton
                    onClick={openGAModal}
                    disabled={!title}
                    startIcon={
                      <Image
                        alt="GA title"
                        width={12}
                        height={12}
                        src={ICONS.informationCircle}
                        style={{
                          opacity: title ? 1 : 0.5,
                        }}
                      />
                    }
                    data-testid="ga-table-title-modal"
                  >
                    <span data-testid="ga-table-title-text">
                      {title ? title : t("notAvailable")}
                    </span>
                  </OutlinedLightButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              container
              flexDirection={{ xxs: "column", md: "row", lg: "row" }}
              flexWrap={{ xxs: "wrap", md: "wrap", lg: "wrap", xl: "nowrap" }}
              rowSpacing={2}
            >
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs="auto"
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 0.5 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("govActionCategoryShort")}
                  </Typography>
                  <OutlinedLightButton
                    nonInteractive
                    data-testid="ga-table-category-text"
                  >
                    {getProposalTypeLabel(type)}
                  </OutlinedLightButton>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs="auto"
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 0.5 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("voteStatus")}
                  </Typography>
                  <Box width={85}>
                    <GovActionStatusPill status={vote_status} />
                  </Box>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs="auto"
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 0.5 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("gaStatus")}
                  </Typography>
                  <OutlinedLightButton
                    nonInteractive
                    data-testid="ga-table-status-text"
                  >
                    {status}
                  </OutlinedLightButton>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs="auto"
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 0.5 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("gaID")}
                  </Typography>
                  <Box display="flex">
                    <CopyPill
                      copyValue={tx_hash}
                      copyText={getShortenedGovActionId(tx_hash)}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid item m={{ xxs: "auto" }} lg={2} xl={2}>
                <Button
                  disabled={isDisabled}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() =>
                    canAddReasoning
                      ? openAddReasoningModal()
                      : openUpdateReasoningModal()
                  }
                  variant="outlined"
                  data-testid="ga-table-rationale-button"
                >
                  {canAddReasoning ? t("addRationale") : t("updateRationale")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};