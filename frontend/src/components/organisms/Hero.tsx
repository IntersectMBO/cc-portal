import React from "react";

import { Box } from "@mui/material";

import { Button } from "@/components/atoms/Button";
import { Typography } from "@/components/atoms/Typography";

import { IMAGES, ICONS, PATHS, customPalette } from "@/constants";

import { useTranslations } from "next-intl";
import Link from "next/link";

export const Hero = () => {
  const t = useTranslations("Index");
  return (
    <Box
      height="80vh"
      alignItems="center"
      display="flex"
      flex={1}
      flexDirection="row"
      overflow="visible"
      position="relative"
      px={{ xxs: 2, sm: 5, md: 10 }}
      sx={{ backgroundColor: customPalette.neutralWhite, zIndex: -100 }}
    >
      <Box alignItems="center" flex={1} height="min-content">
        <Typography variant="headline2" sx={{ whiteSpace: "pre-line" }}>
          {t("hero.headline")}
        </Typography>
        <Typography
          variant="title1"
          sx={{
            maxWidth: 630,
            my: 5,
            whiteSpace: "pre-line",
          }}
        >
          {t("hero.description")}
        </Typography>
        <Link href={PATHS.constitution}>
          <Button size="large" startIcon={<img src={ICONS.rocketLaunch} />}>
            {t("hero.button")}
          </Button>
        </Link>
      </Box>

      <Box
        width={{ xxs: 300, md: 400, lg: "100%" }}
        flex={1}
        right={0}
        top={0}
        zIndex={-1}
        sx={{
          position: { xxs: "absolute", lg: "relative" },
          "& img": {
            width: "100%",
          },
        }}
      >
        <img src={IMAGES.heroImage} />
      </Box>
    </Box>
  );
};
