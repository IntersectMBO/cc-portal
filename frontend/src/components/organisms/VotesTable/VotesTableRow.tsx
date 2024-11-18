"use client";

import { VotesTableI } from "@/lib/requests";
import { Button, OutlinedLightButton, Typography, VotePill } from "@atoms";
import { customPalette } from "@consts";
import { Card, TableDivider, UserAvatar, UserBasicInfo } from "@molecules";
import { Box, Grid, Stack } from "@mui/material";
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
    <Card
      variant="default"
      data-testid="ga-card"
      sx={{
        display: "flex",
        flexDirection: { xxs: "column", md: "row" },
        gap: { xxs: 3, md: 0 },
        width: "100%"
      }}
    >
      <Grid
        container
        flexWrap="nowrap"
        display="flex"
        alignItems="center"
        justifyContent={{ xxs: "center", md: "left" }}
        flexDirection={{ xxs: "column", sm: "row" }}
        xxs="auto"
        md={4}
        lg={4}
        xl={3}
      >
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

      <Stack
        direction="row"
        gap={2}
        useFlexGap
        justifyContent={{ xxs: "center", md: "left", xl: "center" }}
        alignItems="center"
        sx={{ flexWrap: "wrap", minWidth: 0, width: "100%" }}
      >
        <Grid container gap={2} xxs={12} md={6} lg={5} xl={3} flexWrap="nowrap">
          <TableDivider />
          <Grid item>
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
        <Grid container gap={2} xxs={12} md={5} lg={5} xl={3} flexWrap="nowrap">
          <TableDivider />
          <Grid item>
            <Typography
              color={customPalette.neutralGray}
              sx={{ marginBottom: 0.5 }}
              variant="caption"
              fontWeight={500}
            >
              {t("govActionCategoryShort")}
            </Typography>
            <OutlinedLightButton nonInteractive data-testid="ga-category-text">
              {getProposalTypeLabel(gov_action_proposal_type)}
            </OutlinedLightButton>
          </Grid>
        </Grid>
        <Grid
          container
          gap={2}
          xxs={12}
          md={5}
          lg={3}
          xl={1.5}
          flexWrap="nowrap"
        >
          <TableDivider />
          <Grid item>
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
        <Grid
          container
          gap={2}
          xxs={12}
          md={5}
          lg={3}
          xl={1.5}
          flexWrap="nowrap"
        >
          <TableDivider />
          <Grid item>
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
        <Grid
          container
          gap={2}
          xxs={12}
          md={5}
          lg={3}
          xl={1.5}
          flexWrap="nowrap"
        >
          <TableDivider />
          <Grid item>
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
      </Stack>
      <Grid
        container
        gap={2}
        display="flex"
        alignItems="center"
        justifyContent={{ xxs: "center", md: "left" }}
        xxs={12}
        md={5}
        lg={3}
        xl={1}
        flexWrap="nowrap"
      >
        <Grid item display="flex" alignItems="center">
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
    </Card>
  );
};
