"use client";
import React from "react";

import { Box, Button, Grid } from "@mui/material";

import { ICONS, NAV_ITEMS, PATHS, PROTECTED_NAV_ITEMS } from "@consts";
import { Link } from "@atoms";
import { useAppContext } from "@context";
import { TopNavWrapper } from "./TopNavWrapper";
import UserProfileButton from "@/components/molecules/UserProfileButton";
import { isAnyAdminRole } from "@utils";
import NextLink from "next/link";
import { useTranslations } from "next-intl";

export const TopNav = () => {
  const { userSession, user } = useAppContext();
  const t = useTranslations("Navigation");

  const getNavItems = (items = NAV_ITEMS) =>
    items.map((navItem) => (
      <Grid item key={navItem.label}>
        <Link
          data-testid={navItem.dataTestId}
          label={navItem.label}
          href={navItem.href}
        />
      </Grid>
    ));

  const renderAuthNavItems = () => {
    return (
      <>
        {getNavItems()}
        {/**   {getNavItems(PROTECTED_NAV_ITEMS)} */}
        {isAnyAdminRole(userSession.role) && (
          <Button
            endIcon={<img src={ICONS.arrowUpRight} />}
            variant="outlined"
            href={PATHS.admin.dashboard}
            component={NextLink}
          >
            {t("adminDashboard")}
          </Button>
        )}
        <UserProfileButton user={user} />
      </>
    );
  };

  return (
    <TopNavWrapper homeRedirectionPath={PATHS.home}>
      <Box>
        <Grid container gap={4} alignItems="center">
          {userSession ? renderAuthNavItems() : getNavItems()}
        </Grid>
      </Box>
    </TopNavWrapper>
  );
};
