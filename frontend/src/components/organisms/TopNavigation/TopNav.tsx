"use client";
import React, { useEffect } from "react";

import { Box, Grid } from "@mui/material";

import { NAV_ITEMS } from "@consts";
import { Link } from "@atoms";
import { useAppContext, useModal } from "@context";
import { TopNavWrapper } from "./TopNavWrapper";
import { isUserRole } from "@utils";
import AuthButton from "@/components/molecules/AuthButton";

export const TopNav = () => {
  const { userSession, user } = useAppContext();
  const { openModal } = useModal();

  useEffect(() => {
    if (user?.status === "pending") {
      openModal({
        type: "signUpModal",
      });
    }
  }, [user]);

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
        <AuthButton user={user} />
      </Grid>
    );
  };

  return (
    <TopNavWrapper>
      <Box>
        {userSession && isUserRole(userSession.role)
          ? renderAuthNavItems()
          : getNavItems()}
      </Box>
    </TopNavWrapper>
  );
};
