"use client";
import React from "react";

import { Card, TableDivider } from "@molecules";
import { Box, Grid } from "@mui/material";
import { UserAvatar } from "@molecules";
import {
  Button,
  GovActionStatusPill,
  OutlinedLightButton,
  Typography,
} from "@atoms";
import {
  GovActionModalState,
  GovernanceActionTableI,
  OpenAddReasoningModalState,
  OpenPreviewReasoningModal,
  OpenReasoningLinkModalState,
} from "../types";
import { customPalette, ICONS } from "@consts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { truncateText } from "@utils";
import { getProposalTypeLabel } from "@utils";
import { useModal } from "@context";

interface Props {
  govActions: GovernanceActionTableI;
}

export const GovActionTableRow = ({
  govActions: {
    abstract,
    gov_action_proposal_status,
    gov_action_proposal_id,
    gov_action_proposal_title,
    gov_action_proposal_type,
  },
}: Props) => {
  const t = useTranslations("GovernanceActions");
  const govActionModal = useModal<GovActionModalState>();
  const addReasoningModal = useModal<OpenAddReasoningModalState>();
  const reasoningLinkModal = useModal<OpenReasoningLinkModalState>();
  const updateReasoningkModal = useModal<OpenPreviewReasoningModal>();

  const isDisabled = false; //todo
  const isUnvoted = gov_action_proposal_status === "UNVOTED";

  const openGAModal = () => {
    govActionModal.openModal({
      type: "govActionModal",
      state: {
        id: gov_action_proposal_id,
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
        id: gov_action_proposal_id,
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
        id: gov_action_proposal_id,
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
                  disabled={!gov_action_proposal_title}
                  startIcon={
                    <Image
                      alt="GA title"
                      width={12}
                      height={12}
                      src={ICONS.informationCircle}
                      style={{
                        opacity: gov_action_proposal_title ? 1 : 0.5,
                      }}
                    />
                  }
                >
                  {gov_action_proposal_title
                    ? truncateText(gov_action_proposal_title, 40)
                    : t("notAvailable")}
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
                  {getProposalTypeLabel(gov_action_proposal_type)}
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
                  {t("status")}
                </Typography>
                <Box width={85}>
                  <GovActionStatusPill status={gov_action_proposal_status} />
                </Box>
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
                  {t("abstract")}
                </Typography>
                <Typography variant="caption">
                  {abstract ? truncateText(abstract, 100) : t("notAvailable")}
                </Typography>
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
                isUnvoted ? openAddReasoningModal() : openUpdateReasoningModal()
              }
              variant="outlined"
            >
              {isUnvoted ? t("addReasoning") : t("updateReasoning")}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
