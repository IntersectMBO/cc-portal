"use client";

import { Button, Typography } from "@atoms";
import { PATHS } from "@consts";
import { useModal } from "@context";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

export const AdminFooter = () => {
  const t = useTranslations("Footer");
  const { openModal } = useModal();

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        justifyContent: "space-between",
        px: { xxs: 2, sm: 6, md: 18 },
        py: 3,
        mb: { xxs: 3 }
      }}
    >
      <Typography fontWeight={500} variant="caption">
        {t("copyright")}
      </Typography>
      <Button
        onClick={() =>
          openModal({
            type: "signOutModal",
            state: {
              homeRedirectionPath: PATHS.admin.home
            }
          })
        }
        variant="outlined"
        size="medium"
        data-testid="admin-signout-button"
      >
        {t("signOut")}
      </Button>
    </Box>
  );
};
