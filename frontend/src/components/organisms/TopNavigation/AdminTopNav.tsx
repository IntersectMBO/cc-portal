"use client";
import React from "react";

import { Box, Grid } from "@mui/material";

import { Button as MUIButton } from "@mui/material";
import { Button } from "@atoms";
import { TopNavWrapper } from "./TopNavWrapper";
import { useTranslations } from "next-intl";
import { useAppContext, useModal } from "@context";
import PermissionChecker from "../PermissionChecker";
import { IMAGES, PATHS } from "@consts";
import Link from "next/link";

export const AdminTopNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const t = useTranslations("Navigation");
  const { openModal } = useModal();
  const { userSession } = useAppContext();

  const addMember = () =>
    openModal({
      type: "addMember",
    });

  const addVersion = () => openModal({ type: "uploadConstitution" });

  return (
    <TopNavWrapper homeRedirectionPath={PATHS.admin.dashboard}>
      {isLoggedIn && (
        <Box>
          <Grid container gap={2}>
            <MUIButton
              startIcon={<img src={IMAGES.bookOpen} />}
              variant="outlined"
              href={PATHS.constitution}
              component={Link}
            >
              {t("seeConstituton")}
            </MUIButton>
            <PermissionChecker
              permissions={userSession?.permissions}
              requiredPermission="manage_cc_members"
            >
              <Button onClick={addMember} variant="outlined">
                {t("addNewMember")}
              </Button>
            </PermissionChecker>
            <PermissionChecker
              permissions={userSession?.permissions}
              requiredPermission="add_constitution_version"
            >
              <Button type="submit" onClick={addVersion}>
                {t("uploadNewVersion")}
              </Button>
            </PermissionChecker>
          </Grid>
        </Box>
      )}
    </TopNavWrapper>
  );
};
