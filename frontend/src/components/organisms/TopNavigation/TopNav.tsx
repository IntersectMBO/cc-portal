"use client";
import React from "react";

import { Box, Grid } from "@mui/material";

import { NAV_ITEMS, PATHS } from "@consts";
import { Link } from "@atoms";
import { useAppContext } from "@context";
import { TopNavWrapper } from "./TopNavWrapper";
import UserProfileButton from "@/components/molecules/UserProfileButton";

export const TopNav = () => {
  const { userSession, user } = useAppContext();

  const getNavItems = () =>
    NAV_ITEMS.map((navItem) => (
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
      <Grid container gap={2} alignItems="center">
        {getNavItems()}
        <UserProfileButton user={user} />
      </Grid>
    );
  };

  return (
    <TopNavWrapper homeRedirectionPath={PATHS.home}>
      <Box>{userSession ? renderAuthNavItems() : getNavItems()}</Box>
    </TopNavWrapper>
  );
};
