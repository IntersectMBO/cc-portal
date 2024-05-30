"use client";

import React from "react";
import { Button, SxProps, Theme } from "@mui/material";
import { customPalette } from "@consts";
import { ButtonProps } from "@mui/material/Button";

interface Props extends ButtonProps {
  sx?: SxProps<Theme>;
  nonInteractive?: boolean; // Custom prop to disable interactions
}

export const OutlinedLightButton = ({
  children,
  sx,
  onClick,
  size = "small",
  variant = "outlined",
  nonInteractive = false,
  ...props
}: Props) => {
  const defaultSxProps = {
    color: customPalette.textBlack,
    fontWeight: 400,
    fontSize: 12,
    whiteSpace: "nowrap",
    "&": {
      pointerEvents: nonInteractive ? "none" : "all",
    },
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={nonInteractive ? undefined : onClick}
      sx={{
        ...defaultSxProps,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
