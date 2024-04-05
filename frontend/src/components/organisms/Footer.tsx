import React from "react";

import { Box } from "@mui/material";
import { Typography } from "../atoms/Typography";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        px: { xxs: 2, sm: 6, md: 8, xl: 10 },
        py: 4,
      }}
    >
      <Typography fontWeight={500} variant="caption">
        {t("copyright")}
      </Typography>
    </Box>
  );
};
