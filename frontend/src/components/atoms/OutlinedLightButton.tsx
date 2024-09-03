"use client";

import { customPalette } from "@consts";
import { Button, SxProps, Theme } from "@mui/material";
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
    lineHeight: "18px",
    whiteSpace: "normal;",
    "&": {
      pointerEvents: nonInteractive ? "none" : "all"
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={nonInteractive ? undefined : onClick}
      sx={{
        ...defaultSxProps,
        ...sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
