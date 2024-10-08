"use client";
import React, { ReactNode } from "react";

import { AppBar, SxProps } from "@mui/material";

import { ICONS, customPalette } from "@consts";
import NextLink from "next/link";

interface Props {
  children: ReactNode;
  homeRedirectionPath: string;
  sx?: SxProps;
}

export const TopNavWrapper = ({ children, homeRedirectionPath, sx }: Props) => {
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
        position: "sticky",
        py: { xxs: 2, sm: 3 },
        px: { xxs: 2, sm: 5 },
        "& img": {
          width: "100%",
        },
        gap: "40px",
        ...sx,
      }}
    >
      <NextLink data-testid="logo-button" href={homeRedirectionPath}>
        <img height={35} src={ICONS.logoSign} />
      </NextLink>
      {children}
    </AppBar>
  );
};
