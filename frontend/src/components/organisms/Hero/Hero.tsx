import { Box } from "@mui/material";

import { Typography } from "@/components/atoms/Typography";

import { IMAGES, customPalette } from "@/constants";

import { useTranslations } from "next-intl";
import { HeroProps } from "../types";

export const Hero = ({ children }: HeroProps) => {
  const t = useTranslations("Index");
  return (
    <Box
      alignItems="center"
      display="flex"
      flex={1}
      flexDirection="row"
      overflow="hidden"
      position="relative"
      px={{ xxs: 2, sm: 5, md: 10 }}
      sx={{ backgroundColor: customPalette.arcticWhite }}
      minHeight={{ xxs: "90vh", md: "auto" }}
    >
      <Box alignItems="center" flex={1} height="min-content" zIndex={1}>
        <Typography
          variant="headline2"
          sx={{ whiteSpace: "pre-line" }}
          data-testid="hero-section-title-text"
        >
          {t("hero.headline")}
        </Typography>
        <Typography
          variant="title1"
          sx={{
            maxWidth: 630,
            my: { xxs: 2, md: 2 },
            whiteSpace: "pre-line",
          }}
          data-testid="hero-section-description-text"
        >
          {t("hero.description")}
        </Typography>
        {children}
      </Box>

      <Box
        width={{ xxs: 300, md: 400, lg: 558 }}
        flex={1}
        right={0}
        top={0}
        zIndex={0}
        sx={{
          position: { xxs: "absolute", lg: "relative" },
          "& img": {
            maxHeight: 558,
          },
        }}
      >
        <img src={IMAGES.heroImage} />
      </Box>
    </Box>
  );
};
