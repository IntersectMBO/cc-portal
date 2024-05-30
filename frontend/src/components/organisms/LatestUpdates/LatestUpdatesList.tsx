import React from "react";
import { Box, Grid } from "@mui/material";
import { NotFound } from "../NotFound";
import { LatestUpdates } from "../types";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { LatestUpdatesListItem } from "./LatestUpdatesListItem";

export const LatestUpdatesList = ({
  latestUpdates,
}: {
  latestUpdates: LatestUpdates[];
}) => {
  const t = useTranslations("LatestUpdates");

  if (latestUpdates?.length === 0 || latestUpdates === undefined) {
    return (
      <NotFound
        title="latestUpdates.title"
        description="latestUpdates.description"
      />
    );
  }

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Typography sx={{ paddingBottom: 4 }} variant="headline4">
        {t("title")}
      </Typography>
      <Grid container direction="column" gap={0}>
        {latestUpdates.map((data, index) => (
          <Grid key={index} item data-testid={`latest-updates-${data.id}-card`}>
            <LatestUpdatesListItem {...data} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
