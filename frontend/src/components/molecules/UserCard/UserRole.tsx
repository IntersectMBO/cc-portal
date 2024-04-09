import React from "react";

import { ChipList, Typography } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";

export const UserRole = ({ roles }: { roles: string[] }) => {
  const t = useTranslations("AdminDashboard");

  return (
    <>
      <Typography
        color={customPalette.neutralGray}
        sx={{ marginBottom: 0.5 }}
        variant="caption"
        fontWeight={500}
      >
        {t("role")}
      </Typography>

      <ChipList list={roles} />
    </>
  );
};