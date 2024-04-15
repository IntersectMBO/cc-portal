import React from "react";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { Button, Typography } from "@atoms";

export const AdminFooter = () => {
  const t = useTranslations("Footer");

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        px: { xxs: 2, sm: 6, md: 8, xl: 10 },
        py: 4,
      }}
    >
      <Typography fontWeight={500} variant="caption">
        {t("copyright")}
      </Typography>
      <Button variant="outlined">{t("signOut")}</Button>
    </Box>
  );
};
