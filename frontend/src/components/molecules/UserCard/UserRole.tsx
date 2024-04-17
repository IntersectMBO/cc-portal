"use client";
import React from "react";

import { ChipList, Typography } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";
import { UserRole as UserRoleType } from "@/lib/requests";
import { formatRoleList } from "@utils";

export const UserRole = ({ roles }: { roles: UserRoleType[] }) => {
  const t = useTranslations("AdminDashboard");
  const formattedRoleList = formatRoleList(roles);

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

      <ChipList list={formattedRoleList} />
    </>
  );
};
