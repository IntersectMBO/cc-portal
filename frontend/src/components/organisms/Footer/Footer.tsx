"use client";

import { EXTERNAL_LINKS, ICONS } from "@/constants";
import { Typography } from "@atoms";
import { useAppContext, useModal } from "@context";
import { useScreenDimension } from "@hooks";
import {
  Grid,
  Hidden,
  Button as MUIButton,
  Typography as MUITypography,
  SxProps
} from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = ({
  showSignIn = true,
  sx,
  isFixed = false,
  bgColor = "#FFF"
}: {
  showSignIn?: boolean;
  sx?: SxProps;
  isFixed?: boolean;
  bgColor?: string;
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
          ? { position: "fixed", bottom: 0, backgroundColor: bgColor, ...sx }
          : { backgroundColor: bgColor, ...sx }
      }
    >
      <Hidden mdDown>
        <Grid item>
          <Typography
            fontWeight={400}
            variant="caption"
            data-testid="footer-copy-right-text"
          >
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
      <Grid item xxs={12} md="auto">
        <Grid
          container
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            fontWeight={400}
            variant="caption"
            data-testid="footer-privacy-policy-hyperlink"
          >
            {t("privacyPolicy")}
          </Typography>
          <Typography
            fontWeight={400}
            variant="caption"
            data-testid="footer-terms-of-service-hyperlink"
          >
            {t("termsOfService")}
          </Typography>

          {!userSession && showSignIn && (
            <Typography fontWeight={400} variant="caption">
              {t("AreYouCCMember")}
              <MUITypography
                component="span"
                fontSize="12px"
                lineHeight="16px"
                sx={{ cursor: "pointer", ml: 1 }}
                fontWeight={500}
                variant="caption"
                data-testid="footer-sign-in-button"
                onClick={() => {
                  openModal({
                    type: "signIn"
                  });
                }}
              >
                <span data-testid="footer-sign-in-text">{t("signIn")}</span>
              </MUITypography>
            </Typography>
          )}
          <MUIButton
            component={Link}
            target="_blank"
            href={EXTERNAL_LINKS.guides}
            startIcon={<img src={ICONS.help} />}
            variant="text"
            data-testid="footer-guides-button"
          >
            {t("guides")}
          </MUIButton>
        </Grid>
      </Grid>

      <Grid item minWidth={130}>
        <Grid
          container
          gap={{ xxs: 0, md: 2 }}
          justifyContent={{ xxs: "center", md: "flex-start" }}
          flexDirection={{ xxs: "column", md: "row" }}
        ></Grid>
      </Grid>

      <Hidden mdUp>
        <Grid item xxs={12} mt={2}>
          <Typography fontWeight={400} variant="caption">
            {t("copyright")}
          </Typography>
        </Grid>
      </Hidden>
    </Grid>
  );
};
