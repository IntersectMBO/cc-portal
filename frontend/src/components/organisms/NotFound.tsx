import React from "react";

import { Box } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { customPalette } from "@/constants";

export function NotFound({
  title,
  description,
  height = "70vh",
}: {
  title: string;
  description: string;
  height?: string;
}) {
  const t = useTranslations("NotFound");

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height }}
    >
      <Box
        sx={{
          width: { xxs: "80%", md: 500 },
          textAlign: "center",
          border: `1px solid ${customPalette.lightBlue}`,
        }}
        px={3}
        py={5}
      >
        <Typography fontWeight={600} variant="title2">
          {t(title)}
        </Typography>
        <Typography fontWeight={400} variant="body1">
          {t(description)}
        </Typography>
      </Box>
    </Box>
  );
}
