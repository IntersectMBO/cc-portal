"use client";
import React, { useState } from "react";

import { Box, Button, Grid, Hidden, IconButton } from "@mui/material";

import {
  customPalette,
  ICONS,
  NAV_ITEMS,
  PATHS,
  PROTECTED_NAV_ITEMS,
} from "@consts";
import { Link } from "@atoms";
import { useAppContext } from "@context";
import { TopNavWrapper } from "./TopNavWrapper";
import UserProfileButton from "@/components/molecules/UserProfileButton";
import { isAnyAdminRole, isUserRole } from "@utils";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import MenuIcon from "@mui/icons-material/Menu";
import { DrawerMobile } from "./DrawerMobile";

export const TopNav = () => {
  const { userSession, user } = useAppContext();
  const t = useTranslations("Navigation");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const getNavItems = (items = NAV_ITEMS) =>
    items.map((navItem) => (
      <Grid item key={navItem.label}>
        <Link
          dataTestId={`top-nav-${navItem.href.replace("/", "")}-link`}
          label={navItem.label}
          href={navItem.href}
        />
      </Grid>
    ));

  const renderAuthNavItems = () => {
    return (
      <>
        {getNavItems()}
        {getNavItems(PROTECTED_NAV_ITEMS)}
        {isAnyAdminRole(userSession.role) && (
          <Button
            endIcon={<img src={ICONS.arrowUpRight} />}
            variant="outlined"
            href={PATHS.admin.dashboard}
            component={NextLink}
            data-testid="top-nav-admin-dashboard-button"
          >
            {t("adminDashboard")}
          </Button>
        )}
        {isUserRole(userSession.role) && <UserProfileButton user={user} />}
      </>
    );
  };

  return (
    <TopNavWrapper homeRedirectionPath={PATHS.home}>
      <Hidden mdDown>
        <Box>
          <Grid container gap={4} alignItems="center" flexWrap="nowrap">
            {userSession ? renderAuthNavItems() : getNavItems()}
          </Grid>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <IconButton
          data-testid="open-drawer-button"
          onClick={openDrawer}
          sx={{
            bgcolor: customPalette.arcticWhite,
          }}
        >
          <MenuIcon color="primary" />
        </IconButton>
      </Hidden>

      <DrawerMobile
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        {userSession ? renderAuthNavItems() : getNavItems()}
      </DrawerMobile>
    </TopNavWrapper>
  );
};
