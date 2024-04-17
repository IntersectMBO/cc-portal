"use client";
import React from "react";

import { Box, Grid } from "@mui/material";

import { Button } from "@atoms";
import { TopNavWrapper } from "./TopNavWrapper";
import { useTranslations } from "next-intl";
import { useAppContext, useModal } from "@context";
import PermissionChecker from "../PermissionChecker";

export const AdminTopNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const t = useTranslations("Navigation");
  const { openModal } = useModal();
  const { userSession } = useAppContext();

  const addMember = () =>
    openModal({
      type: "addMember",
    });

  return (
    <TopNavWrapper>
      {isLoggedIn && (
        <Box>
          <Grid container gap={2}>
            <PermissionChecker
              permissions={userSession.permissions}
              requiredPermission="manage_cc_members"
            >
              <Button onClick={addMember} variant="outlined">
                {t("addNewMember")}
              </Button>
            </PermissionChecker>
            <PermissionChecker
              permissions={userSession.permissions}
              requiredPermission="add_constitution_version"
            >
              <Button type="submit"> {t("uploadNewVersion")}</Button>
            </PermissionChecker>
          </Grid>
        </Box>
      )}
    </TopNavWrapper>
  );
};
