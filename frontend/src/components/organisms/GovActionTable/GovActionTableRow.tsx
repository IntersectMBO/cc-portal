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
import { customPalette, ICONS } from "@consts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getShortenedGovActionId, truncateText } from "@utils";
import { getProposalTypeLabel } from "@utils";
import { useModal } from "@context";
import { GovernanceActionTableI } from "@/lib/requests";

interface Props {
  govActions: GovernanceActionTableI;
}

export const GovActionTableRow = ({
  govActions: { id, vote_status, status, title, type, has_reasoning },
}: Props) => {
  const t = useTranslations("GovernanceActions");
  const govActionModal = useModal<GovActionModalState>();
  const addReasoningModal = useModal<OpenAddReasoningModalState>();
  const reasoningLinkModal = useModal<OpenReasoningLinkModalState>();
  const updateReasoningkModal = useModal<OpenPreviewReasoningModal>();

  const isDisabled = false; //todo
  const isUnvoted = vote_status === "UNVOTED";
  //User can add reasoning in two cases:
  // 1. User doesn't have vote for selected GA
  // 2. User has vote for selected GA, but doesn't have reasoning
  const canAddReasoning =
    isUnvoted || (!has_reasoning && vote_status === "VOTED");

  const openGAModal = () => {
    govActionModal.openModal({
      type: "govActionModal",
      state: {
        id,
      },
    });
  };
  const openUpdateReasoningCallback = () => {
    updateReasoningkModal.closeModal();
    openAddReasoningModal();
  };
  const openUpdateReasoningModal = () => {
    updateReasoningkModal.openModal({
      type: "previewReasoningModal",
      state: {
        id,
        actionTitle: t("updateReasoning"),
        onActionClick: openUpdateReasoningCallback,
      },
    });
  };

  const openReasoningLinkModal = () => {
    reasoningLinkModal.openModal({
      type: "reasoningLinkModal",
      state: {
        hash: "324rfwdf123abcdH76ADF8utkm",
        link: "djfs.fems.com",
      },
    });
  };

  const addReasoningCallback = () => {
    addReasoningModal.closeModal();
    openReasoningLinkModal();
  };

  const openAddReasoningModal = () => {
    addReasoningModal.openModal({
      type: "addReasoningModal",
      state: {
        id,
        callback: addReasoningCallback,
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
          flexDirection={{ xs: "column", xl: "row" }}
          justifyContent="space-between"
          flexWrap="nowrap"
          gap={{ xs: 0, xl: 3 }}
        >
          <Grid item xs={12} xl={10}>
            <Grid
              container
              flexDirection={{ xs: "column", lg: "row" }}
              flexWrap={{ xxs: "wrap", lg: "nowrap" }}
            >
              <Grid item xs="auto" mb={{ xxs: 2, lg: 0 }}>
                <UserAvatar src={ICONS.govAction} />
              </Grid>
              <Grid
                item
                xs="auto"
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
                xs="auto"
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
                  {getProposalTypeLabel(type)}
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
                    <CopyButton size={14} text={id} />
                    <Typography variant="caption">
                      {getShortenedGovActionId(id)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            xl="auto"
            textAlign={{ xs: "right", xl: "center" }}
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
