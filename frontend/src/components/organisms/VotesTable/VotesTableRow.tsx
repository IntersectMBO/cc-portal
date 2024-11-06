"use client";

import { VotesTableI } from "@/lib/requests";
import { Button, OutlinedLightButton, Typography, VotePill } from "@atoms";
import { customPalette } from "@consts";
import { Card, TableDivider, UserAvatar, UserBasicInfo } from "@molecules";
import { Box, Grid } from "@mui/material";
import { formatDisplayDate, getProposalTypeLabel, truncateText } from "@utils";
import { useTranslations } from "next-intl";

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
  const {
    user_name,
    user_address,
    user_photo_url,
    value,
    rationale_url,
    gov_action_proposal_title,
    gov_action_proposal_type,
    vote_submit_time
  } = votes;

  return (
    <Grid
      item
      mb={3}
      sx={{
        opacity: disabled && 0.5
      }}
    >
      <Card variant="default" data-testid="ga-card">
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
                  xxs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 1 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("govAction")}
                  </Typography>

                  <Typography variant="caption">
                    {gov_action_proposal_title
                      ? truncateText(gov_action_proposal_title, 40)
                      : t("notAvailable")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs={12}
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
                    data-testid="ga-category-text"
                  >
                    {getProposalTypeLabel(gov_action_proposal_type)}
                  </OutlinedLightButton>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />
                <Grid
                  item
                  xxs={12}
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

                  <Box display="flex" alignItems="center" gap={2}>
                    <VotePill vote={value} />
                  </Box>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={2}>
                <TableDivider />
                <Grid
                  item
                  xxs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 1 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("time")}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="caption">
                      {formatDisplayDate(vote_submit_time)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid item display="flex" md={12} lg={5} xl={3}>
                <TableDivider />

                <Grid
                  item
                  xxs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  px={{ xxs: 0, md: 3, lg: 3, xl: 3 }}
                  py={{ xxs: 1.5, md: 0 }}
                >
                  <Typography
                    color={customPalette.neutralGray}
                    sx={{ marginBottom: 1 }}
                    variant="caption"
                    fontWeight={500}
                  >
                    {t("rationale")}
                  </Typography>
                  <Typography variant="caption" data-testid="ga-rationale-text">
                    {rationale_url ? t("available") : t("notAvailable")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item m={{ xxs: "auto" }} lg={2} xl={2}>
                <Button
                  disabled={disabled}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => onActionClick(votes)}
                  variant="outlined"
                  data-testid="ga-show-more-button"
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
