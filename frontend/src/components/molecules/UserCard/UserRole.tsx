"use client";
import React from "react";

import { ChipList, Typography } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";
import { UserRole as UserRoleType } from "@/lib/requests";

export const UserRole = ({ roles }: { roles: UserRoleType[] }) => {
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
