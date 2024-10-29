"use client";
import { useEffect, useState } from "react";

import { Box, Grid, Hidden, IconButton } from "@mui/material";

import { Button } from "@atoms";
import { IMAGES, PATHS } from "@consts";
import { useAppContext, useModal } from "@context";
import { useManageQueryParams } from "@hooks";
import { Search } from "@molecules";
import { Button as MUIButton } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import PermissionChecker from "../PermissionChecker";
import { DrawerMobile } from "./DrawerMobile";
import { TopNavWrapper } from "./TopNavWrapper";

export const AdminTopNav = () => {
  const t = useTranslations("Navigation");
  const { openModal } = useModal();
  const { userSession } = useAppContext();
  const [searchText, setSearchText] = useState<string>("");
  const { updateQueryParams } = useManageQueryParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const params: Record<string, string | null> = {
      search: searchText || null
    };
    updateQueryParams(params);
  }, [searchText, updateQueryParams]);

  const addMember = () =>
    openModal({
      type: "addMember"
    });

  const uploadConstitution = () => openModal({ type: "uploadConstitution" });

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const getNavItems = () => (
    <Box
      display="flex"
      flexDirection={{ xxs: "column", md: "row" }}
      justifyContent="space-between"
      width="100%"
    >
      <Hidden mdDown>
        <Search
          setSearchText={setSearchText}
          dataTestId="admin-top-nav-search-input"
        />
      </Hidden>
      <Grid
        container
        gap={2}
        flexDirection={{ xxs: "column", md: "row" }}
        justifyContent={{ xxs: "center", md: "flex-end" }}
      >
        <MUIButton
          startIcon={<img src={IMAGES.bookOpen} />}
          variant="outlined"
          href={PATHS.constitution}
          component={Link}
          data-testid="admin-top-nav-see-constitution-button"
        >
          {t("seeConstituton")}
        </MUIButton>
        <PermissionChecker
          permissions={userSession?.permissions}
          requiredPermission="manage_cc_members"
        >
          <Button
            size="extraLarge"
            onClick={addMember}
            variant="outlined"
            data-testid="admin-top-nav-add-member-button"
          >
            {t("addNewMember")}
          </Button>
        </PermissionChecker>
        <PermissionChecker
          permissions={userSession?.permissions}
          requiredPermission="add_constitution_version"
        >
          <Button
            size="extraLarge"
            type="submit"
            onClick={uploadConstitution}
            data-testid="admin-top-nav-upload-constitution-button"
          >
            {t("uploadNewVersion")}
          </Button>
        </PermissionChecker>
      </Grid>
    </Box>
  );

  return (
    <TopNavWrapper
      homeRedirectionPath={PATHS.admin.dashboard}
      sx={{ justifyContent: "flex-Start" }}
    >
      {!!userSession && (
        <>
          <Hidden mdUp>
            <Search
              setSearchText={setSearchText}
              dataTestId="admin-top-nav-search-input"
            />
          </Hidden>
          <Hidden mdDown>{getNavItems()}</Hidden>
          <Hidden mdUp>
            <IconButton data-testid="open-drawer-button" onClick={openDrawer}>
              <img src={IMAGES.menu} />
            </IconButton>
          </Hidden>
          <DrawerMobile
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          >
            {getNavItems()}
          </DrawerMobile>
        </>
      )}
    </TopNavWrapper>
  );
};
