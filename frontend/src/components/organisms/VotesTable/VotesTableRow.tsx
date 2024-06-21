"use client";
import React from "react";

import { Card, TableDivider } from "@molecules";
import { Box, Grid } from "@mui/material";
import { UserAvatar, UserBasicInfo } from "@molecules";
import { Button, OutlinedLightButton, Typography, VotePill } from "@atoms";
import { GovActionModalState, VotesTableI } from "../types";
import { customPalette, ICONS } from "@consts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { truncateText } from "@utils";
import { getProposalTypeLabel } from "@utils";
import { useModal } from "@context";

interface Props {
  votes: VotesTableI;
  disabled: boolean;
  actionTitle: string;
  onActionClick: (id: string) => void;
}

export const VotesTableRow = ({
  votes: {
    user_name,
    user_address,
    user_photo_url,
    value,
    reasoning_comment,
    gov_action_proposal_id,
    gov_action_proposal_title,
    gov_action_proposal_type,
  },
  disabled,
  actionTitle,
  onActionClick,
}: Props) => {
  const t = useTranslations("LatestUpdates");
  const { openModal } = useModal<GovActionModalState>();

  const openGAModal = () => {
    openModal({
      type: "govActionModal",
      state: {
        id: gov_action_proposal_id,
      },
    });
  };

  return (
    <Grid
      item
      mb={3}
      sx={{
        opacity: disabled && 0.5,
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
          <Grid item xs={12} xl={11}>
            <Grid
              container
              flexDirection={{ xs: "column", lg: "row" }}
              flexWrap={{ xxs: "wrap", lg: "nowrap" }}
            >
              <Grid item xs="auto" lg={3} xl={2} mb={{ xxs: 2, lg: 0 }}>
                <Grid container flexWrap="nowrap">
                  <Grid item>
                    <UserAvatar src={user_photo_url} />
                  </Grid>
                  <Grid item>
                    <UserBasicInfo
                      name={user_name}
                      hotAddress={user_address}
                      maxWidth={200}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <TableDivider />
              <Grid
                item
                xs="auto"
                lg={3}
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
                  disabled={disabled || !gov_action_proposal_title}
                  startIcon={
                    <Image
                      alt="GA title"
                      width={12}
                      height={12}
                      src={ICONS.informationCircle}
                      style={{ opacity: gov_action_proposal_title ? 1 : 0.5 }}
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
                xl={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("voted")}
                </Typography>
                <Box width={85}>
                  <VotePill vote={value} />
                </Box>
              </Grid>
              <TableDivider />
              <Grid
                item
                lg={3}
                xl={3}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("reasoning")}
                </Typography>
                <Typography variant="caption">
                  {reasoning_comment
                    ? truncateText(reasoning_comment, 100)
                    : t("notAvailable")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            xl={1}
            textAlign={{ xs: "right", xl: "center" }}
            mt={{ xxs: 2, xl: 0 }}
          >
            <Button
              disabled={disabled}
              sx={{ whiteSpace: "nowrap" }}
              onClick={() => onActionClick(gov_action_proposal_id)}
              variant="outlined"
            >
              {actionTitle}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};