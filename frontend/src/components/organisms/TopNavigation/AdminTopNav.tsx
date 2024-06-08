"use client";
import React, { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";

import { Button as MUIButton } from "@mui/material";
import { Button } from "@atoms";
import { TopNavWrapper } from "./TopNavWrapper";
import { useTranslations } from "next-intl";
import { useAppContext, useModal } from "@context";
import PermissionChecker from "../PermissionChecker";
import { IMAGES, PATHS } from "@consts";
import Link from "next/link";
import { Search } from "@molecules";
import { useSearchFilters } from "@utils";

export const AdminTopNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const t = useTranslations("Navigation");
  const { openModal } = useModal();
  const { userSession } = useAppContext();
  const [searchText, setSearchText] = useState<string>("");
  const { updateSearchParams } = useSearchFilters();

  useEffect(() => {
    const params: Record<string, string | null> = {
      search: searchText || null,
    };
    updateSearchParams(params);
  }, [searchText, updateSearchParams]);

  const addMember = () =>
    openModal({
      type: "addMember",
    });

  const addVersion = () => openModal({ type: "uploadConstitution" });

  return (
    <TopNavWrapper
      homeRedirectionPath={PATHS.admin.dashboard}
      sx={{ justifyContent: "flex-Start" }}
    >
      {isLoggedIn && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Search setSearchText={setSearchText} />
          <Grid container gap={2} justifyContent="flex-end">
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
              <Button size="extraLarge" onClick={addMember} variant="outlined">
                {t("addNewMember")}
              </Button>
            </PermissionChecker>
            <PermissionChecker
              permissions={userSession?.permissions}
              requiredPermission="add_constitution_version"
            >
              <Button size="extraLarge" type="submit" onClick={addVersion}>
                {t("uploadNewVersion")}
              </Button>
            </PermissionChecker>
          </Grid>
        </Box>
      )}
    </TopNavWrapper>
  );
};
