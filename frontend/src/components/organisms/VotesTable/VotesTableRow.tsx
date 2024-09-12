"use client";

import { VotesTableI } from "@/lib/requests";
import { Button, OutlinedLightButton, Typography, VotePill } from "@atoms";
import { customPalette, ICONS } from "@consts";
import { useModal } from "@context";
import { Card, TableDivider, UserAvatar, UserBasicInfo } from "@molecules";
import { Box, Grid } from "@mui/material";
import { getProposalTypeLabel, truncateText } from "@utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { GovActionModalState } from "../types";

interface Props {
  votes: VotesTableI;
  disabled: boolean;
  actionTitle: string;
  onActionClick: (action: VotesTableI) => void;
}

export const VotesTableRow = ({
  votes,
  disabled,
  actionTitle,
  onActionClick
}: Props) => {
  const t = useTranslations("LatestUpdates");
  const { openModal } = useModal<GovActionModalState>();
  const {
    user_name,
    user_address,
    user_photo_url,
    value,
    reasoning_comment,
    gov_action_proposal_id,
    gov_action_proposal_title,
    gov_action_proposal_type
  } = votes;
  const openGAModal = () => {
    openModal({
      type: "govActionModal",
      state: {
        id: gov_action_proposal_id
      }
    });
  };

  return (
    <Grid
      item
      mb={3}
      sx={{
        opacity: disabled && 0.5
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
              xl: "row"
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
                        style={{ opacity: gov_action_proposal_title ? 1 : 0.5 }}
                      />
                    }
                  >
                    {gov_action_proposal_title
                      ? gov_action_proposal_title
                      : t("notAvailable")}
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
                    {t("govActionCategoryShort")}
                  </Typography>
                  <OutlinedLightButton nonInteractive>
                    {getProposalTypeLabel(gov_action_proposal_type)}
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
                    {t("voted")}
                  </Typography>
                  <Box width={85}>
                    <VotePill vote={value} />
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
                    {t("rationale")}
                  </Typography>
                  <Typography variant="caption">
                    {reasoning_comment
                      ? truncateText(reasoning_comment, 100)
                      : t("notAvailable")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item m={{ xxs: "auto" }} lg={2} xl={2}>
                <Button
                  disabled={disabled}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => onActionClick(votes)}
                  variant="outlined"
                >
                  {actionTitle}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
