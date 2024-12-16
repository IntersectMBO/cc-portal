import React from "react";

import { Box, SxProps } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { customPalette } from "@/constants";

export function NotFound({
  title,
  description,
  height = "82vh",
  sx,
}: {
  title: string;
  description: string;
  height?: string;
  sx?: SxProps;
}) {
  const t = useTranslations("NotFound");

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height, backgroundColor: customPalette.neutralWhite }}
    >
      <Box
        sx={{
          width: { xxs: "80%", md: 500 },
          textAlign: "center",
          border: `1px solid ${customPalette.lightBlue}`,
          ...sx,
        }}
        px={3}
        py={5}
      >
        <Typography
          fontWeight={600}
          variant="title2"
          data-testid="not-found-title-text"
        >
          {t(title)}
        </Typography>
        <Typography
          fontWeight={400}
          variant="body1"
          data-testid="not-found-description-text"
        >
          {t(description)}
        </Typography>
      </Box>
    </Box>
  );
}
