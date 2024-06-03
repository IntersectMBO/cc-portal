"use client";

import React from "react";
import { Box } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { VotesTable } from "./VotesTable";
import { VotesTableI } from "./types";
import { NotFound } from "./NotFound";

export const LatestUpdates = ({
  latestUpdates,
}: {
  latestUpdates: VotesTableI[];
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
      <VotesTable
        votes={latestUpdates}
        actionTitle={t("actionTitle")}
        onActionClick={() => console.log("Show Reasoning Modal")}
      />
    </Box>
  );
};
