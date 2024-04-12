import React from "react";

import { Grid } from "@mui/material";
import { StatusPill, Typography, UserStatus as UserStatusType } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";

export const UserStatus = ({ status }: { status: UserStatusType }) => {
  const t = useTranslations("AdminDashboard");

  return (
    <Grid item>
      <Typography
        color={customPalette.neutralGray}
        sx={{ marginBottom: 0.5 }}
        variant="caption"
        fontWeight={500}
      >
        {t("status")}
      </Typography>
      <StatusPill status={status} />
    </Grid>
  );
};
