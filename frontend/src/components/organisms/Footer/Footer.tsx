"use client";
import React from "react";

import {
  Typography as MUITypography,
  Grid,
  SxProps,
  Hidden,
} from "@mui/material";
import { Button, Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { useAppContext, useModal } from "@context";
import { ICONS } from "@/constants";

export const Footer = ({
  showSignIn = true,
  sx,
}: {
  showSignIn?: boolean;
  sx?: SxProps;
}) => {
  const t = useTranslations("Footer");
  const { userSession } = useAppContext();
  const { openModal } = useModal();

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      px={{ xxs: 2, sm: 6, md: 8, xl: 10 }}
      py="20px"
      sx={sx}
    >
      <Hidden mdDown>
        <Grid item>
          <Typography fontWeight={400} variant="caption">
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
      <Grid item>
        <Grid container flexDirection={{ xs: "column", md: "row" }} gap={2}>
          <Typography fontWeight={400} variant="caption">
            {t("privacyPolicy")}
          </Typography>
          <Typography fontWeight={400} variant="caption">
            {t("termsOfService")}
          </Typography>

          {!userSession && showSignIn && (
            <Typography fontWeight={400} variant="caption">
              {t("AreYouCCMember")}
              <MUITypography
                component="span"
                sx={{ cursor: "pointer", ml: { xxs: 0, md: 1 } }}
                fontWeight={500}
                variant="caption"
                onClick={() => {
                  openModal({
                    type: "signIn",
                  });
                }}
              >
                {t("signIn")}
              </MUITypography>
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid item>
        <Grid
          container
          gap={{ xs: 0, md: 2 }}
          justifyContent={{ xs: "center", md: "flex-start" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          <Button startIcon={<img src={ICONS.help} />} variant="text">
            {t("help")}
          </Button>
          <Button variant="outlined">{t("feedback")}</Button>
        </Grid>
      </Grid>

      <Hidden mdUp>
        <Grid item xs={12} textAlign="center" mt={2}>
          <Typography fontWeight={400} variant="caption">
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
    </Grid>
  );
};
