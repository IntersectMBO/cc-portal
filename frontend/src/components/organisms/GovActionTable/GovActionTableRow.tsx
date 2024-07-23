"use client";
import React from "react";

import { Card, TableDivider } from "@molecules";
import { Box, Grid } from "@mui/material";
import { UserAvatar } from "@molecules";
import {
  Button,
  CopyButton,
  GovActionStatusPill,
  OutlinedLightButton,
  Typography,
} from "@atoms";
import {
  GovActionModalState,
  OpenAddReasoningModalState,
  OpenPreviewReasoningModal,
  OpenReasoningLinkModalState,
} from "../types";
import { customPalette, ICONS, PATHS } from "@consts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getShortenedGovActionId, truncateText } from "@utils";
import { getProposalTypeLabel } from "@utils";
import { useModal } from "@context";
import { ReasoningResponseI, GovernanceActionTableI } from "@/lib/requests";
import { useRouter } from "next/navigation";

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
        actionTitle: t("updateReasoning"),
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
        <Grid
          container
          flexDirection={{ xxs: "column", xl: "row" }}
          justifyContent="space-between"
          flexWrap="nowrap"
          gap={{ xxs: 0, xl: 3 }}
        >
          <Grid item xxs={12} xl={10}>
            <Grid
              container
              flexDirection={{ xxs: "column", lg: "row" }}
              flexWrap={{ xxs: "wrap", lg: "nowrap" }}
            >
              <Grid item xxs="auto" mb={{ xxs: 2, lg: 0 }}>
                <UserAvatar src={ICONS.govAction} />
              </Grid>
              <Grid
                item
                xxs="auto"
                lg={2}
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
                >
                  {title ? truncateText(title, 15) : t("notAvailable")}
                </OutlinedLightButton>
              </Grid>
              <TableDivider />
              <Grid
                item
                xxs="auto"
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("govActionCategoryShort")}
                </Typography>
                <OutlinedLightButton nonInteractive>
                  {truncateText(getProposalTypeLabel(type), 20)}
                </OutlinedLightButton>
              </Grid>
              <TableDivider />
              <Grid
                item
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
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
              <TableDivider />
              <Grid
                item
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("gaStatus")}
                </Typography>
                <OutlinedLightButton nonInteractive>
                  {status}
                </OutlinedLightButton>
              </Grid>
              <TableDivider />
              <Grid
                item
                lg={5}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
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
                  <Box
                    px={2.25}
                    py={0.75}
                    border={1}
                    borderColor={customPalette.lightBlue}
                    borderRadius={100}
                    display="flex"
                    flexWrap="nowrap"
                    gap={1}
                  >
                    <CopyButton size={14} text={tx_hash} />
                    <Typography variant="caption">
                      {getShortenedGovActionId(tx_hash)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xxs={12}
            xl="auto"
            textAlign={{ xxs: "right", xl: "center" }}
            mt={{ xxs: 2, xl: 0 }}
          >
            <Button
              disabled={isDisabled}
              sx={{ whiteSpace: "nowrap" }}
              onClick={() =>
                canAddReasoning
                  ? openAddReasoningModal()
                  : openUpdateReasoningModal()
              }
              variant="outlined"
            >
              {canAddReasoning ? t("addReasoning") : t("updateReasoning")}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
