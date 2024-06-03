import React from "react";
import { Box, Grid } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { LatestUpdates } from "./types";
import { NotFound } from "./NotFound";
import { LatestUpdatesListItem } from "./LatestUpdates";

export const MyActions = ({ actions }: { actions: LatestUpdates[] }) => {
  const t = useTranslations("MyActions");

  if (actions?.length === 0 || actions === undefined) {
    return (
      <NotFound title="myActions.title" description="myActions.description" />
    );
  }

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Typography sx={{ paddingBottom: 4 }} variant="headline4">
        {t("title")}
      </Typography>
      <Grid container direction="column" gap={0}>
        {actions.map((data, index) => (
          <Grid key={index} item data-testid={`latest-updates-${data.id}-card`}>
            <LatestUpdatesListItem {...data} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
