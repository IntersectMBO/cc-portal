"use client";
import React from "react";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { Button, Typography } from "@atoms";
import { useModal } from "@context";

export const AdminFooter = () => {
  const t = useTranslations("Footer");
  const { openModal } = useModal();

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        px: { xxs: 2, sm: 6, md: 8, xl: 10 },
        py: 3,
      }}
    >
      <Typography fontWeight={500} variant="caption">
        {t("copyright")}
      </Typography>
      <Button
        onClick={() =>
          openModal({
            type: "signOutModal",
          })
        }
        variant="outlined"
        size="medium"
      >
        {t("signOut")}
      </Button>
    </Box>
  );
};
