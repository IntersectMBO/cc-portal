import React from "react";
import { Box } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { VotesTableI } from "./types";
import { NotFound } from "./NotFound";
import { VotesTable } from "./VotesTable";

export const MyActions = ({ actions }: { actions: VotesTableI[] }) => {
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
      <VotesTable votes={actions} />
    </Box>
  );
};
