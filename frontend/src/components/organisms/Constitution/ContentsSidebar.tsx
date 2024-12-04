"use client";
import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const ContentsSidebar = ({ tableOfContents }) => {
  const t = useTranslations("Constitution");

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent={{ xxs: "center", md: "left" }}
        padding={1}
        pt={{ xxs: 0, md: 2 }}
        px={{ xxs: 1, md: 1 }}
        flexWrap="nowrap"
      >
        <Typography fontWeight={500}>{t("drawer.tableOfContents")}</Typography>
      </Grid>
      <Grid container direction="column" width={{ xxs: "100%", lg: "340px" }}>
        <Grid item container>
          {tableOfContents}
        </Grid>
      </Grid>
    </>
  );
};
