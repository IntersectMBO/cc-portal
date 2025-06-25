"use client";
import { Button } from "@/components/atoms";
import { EXTERNAL_LINKS, ICONS } from "@/constants";
import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const ContentsSidebar = ({ tableOfContents }) => {
  const t = useTranslations("Constitution");

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent={{ xxs: "space-between", md: "space-between" }}
        padding={1}
        pt={{ xxs: 0, md: 2 }}
        px={{ xxs: 1, md: 1 }}
        flexWrap="nowrap"
      >
        <Typography fontWeight={500}>{t("drawer.tableOfContents")}</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => openInNewTab(EXTERNAL_LINKS.constitutionDefinitions)}
          endIcon={
            <img
              src={ICONS.externalLink}
              alt="external link"
              style={{ width: 16, height: 16 }}
            />
          }
        >
          {t("drawer.constitutionDefinitions")}
        </Button>
      </Grid>
      <Grid container direction="column" width={{ xxs: "100%", lg: "340px" }}>
        <Grid item container>
          {tableOfContents}
        </Grid>
      </Grid>
    </>
  );
};
