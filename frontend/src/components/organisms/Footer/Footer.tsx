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
import { useScreenDimension } from "@hooks";
import { FeedbackButton } from "@/components/molecules";

export const Footer = ({
  showSignIn = true,
  sx,
  isFixed = false,
}: {
  showSignIn?: boolean;
  sx?: SxProps;
  isFixed?: boolean;
}) => {
  const t = useTranslations("Footer");
  const { userSession } = useAppContext();
  const { openModal } = useModal();
  const { isMobile } = useScreenDimension();

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      px={{ xxs: 2, sm: 6, md: 8, xl: 10 }}
      py="20px"
      sx={
        isFixed && !isMobile
          ? { position: "fixed", bottom: 0, backgroundColor: "#FFF", ...sx }
          : { backgroundColor: "#FFF", ...sx }
      }
    >
      <Hidden mdDown>
        <Grid item>
          <Typography fontWeight={400} variant="caption">
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
      <Grid item>
        <Grid
          container
          flexDirection={{ xxs: "column", md: "row" }}
          gap={2}
          alignItems={{ xxs: "flex-start", md: "center" }}
        >
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
                fontSize="12px"
                lineHeight="16px"
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
          gap={{ xxs: 0, md: 2 }}
          justifyContent={{ xxs: "center", md: "flex-start" }}
          flexDirection={{ xxs: "column", md: "row" }}
        >
          <Button startIcon={<img src={ICONS.help} />} variant="text">
            {t("help")}
          </Button>
          <FeedbackButton title={t("feedback")} />
        </Grid>
      </Grid>

      <Hidden mdUp>
        <Grid item xxs={12} textAlign="center" mt={2}>
          <Typography fontWeight={400} variant="caption">
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
    </Grid>
  );
};
