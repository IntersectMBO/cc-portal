"use client";
import React, { useEffect } from "react";

import { Box, Grid } from "@mui/material";

import { NAV_ITEMS } from "@consts";
import { Link } from "@atoms";
import { useAppContext } from "@context";
import { TopNavWrapper } from "./TopNavWrapper";
import AuthButton from "@/components/molecules/AuthButton";

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
    <TopNavWrapper>
      <Box>{userSession ? renderAuthNavItems() : getNavItems()}</Box>
    </TopNavWrapper>
  );
};
