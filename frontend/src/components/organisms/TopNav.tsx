"use client";
import React from "react";

import { AppBar, Box, Grid } from "@mui/material";

import { IMAGES, PATHS, NAV_ITEMS, customPalette } from "@consts";
import { Link } from "@/components/atoms";
import NextLink from "next/link";

export const TopNav = () => {
  return (
    <AppBar
      component="nav"
      sx={{
        backgroundColor: customPalette.arcticWhite,
        borderColor: "lightblue",
        borderRadius: 0,
        boxShadow: 0,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        position: "relative",
        py: { xxs: 2, sm: 3 },
        px: { xxs: 2, sm: 5 },
        "& img": {
          width: "100%",
        },
      }}
    >
      <NextLink data-testid="logo-button" href={PATHS.home}>
        <img height={35} src={IMAGES.logoSign} />
      </NextLink>
      <Box>
        {NAV_ITEMS.map((navItem) => (
          <Grid item key={navItem.label}>
            <Link
              data-testid={navItem.dataTestId}
              label={navItem.label}
              href={navItem.href}
            />
          </Grid>
        ))}
      </Box>
    </AppBar>
  );
};
