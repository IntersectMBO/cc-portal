"use client";
import React from "react";

import { AppBar } from "@mui/material";

import { IMAGES, PATHS } from "@consts";
import NextLink from "next/link";

export const TopNavWrapper = ({ children }) => {
  return (
    <AppBar
      component="nav"
      sx={{
        backgroundColor: "white",
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
      {children}
    </AppBar>
  );
};
