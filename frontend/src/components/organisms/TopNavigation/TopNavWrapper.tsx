"use client";
import { ReactNode } from "react";

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
        backgroundColor: customPalette.neutralWhite,
        borderColor: "lightblue",
        borderRadius: 0,
        boxShadow: 0,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        position: "sticky",
        py: { xxs: 2, sm: 2 },
        px: { xxs: 5, sm: 5 },
        "& img": {
          width: "100%"
        },
        gap: "40px",
        ...sx
      }}
    >
      <NextLink data-testid="logo-button" href={homeRedirectionPath}>
        <img height={32} src={ICONS.logoSign} />
      </NextLink>
      {children}
    </AppBar>
  );
};
