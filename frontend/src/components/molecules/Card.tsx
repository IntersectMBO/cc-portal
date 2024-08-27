import { Chip, Paper, SxProps } from "@mui/material";
import { PropsWithChildren } from "react";

import { Theme } from "@/theme";
import {
  customPalette,
  errorRed,
  orange,
  primaryBlue,
  successGreen,
} from "@/constants";

type CardProps = PropsWithChildren & {
  border?: boolean;
  elevation?: number;
  label?: string;
  sx?: SxProps<Theme>;
  variant?: "default" | "error" | "primary" | "success" | "warning";
};

export const Card = ({
  variant = "default",
  border = variant !== "default",
  children,
  elevation = 4,
  label,
  sx,
}: CardProps) => {
  const colors = COLORS[variant];

  return (
    <Paper
      elevation={elevation}
      sx={{
        backgroundColor:
          colors.backgroundColor ?? `${customPalette.neutralWhite}4D`,
        border: border ? 1 : 0,
        borderColor: colors?.borderColor,
        padding: 3,
        position: "relative",
        ...sx,
      }}
    >
      {label && (
        <Chip
          color={variant}
          label={label}
          sx={{
            position: "absolute",
            right: 30,
            top: -15,
          }}
        />
      )}
      {children}
    </Paper>
  );
};

const COLORS = {
  default: {
    backgroundColor: undefined,
    borderColor: primaryBlue.c100,
  },
  warning: {
    backgroundColor: undefined,
    borderColor: orange.c500,
  },
  error: {
    backgroundColor: `${errorRed.c50}80`,
    borderColor: errorRed.c100,
  },
  primary: {
    backgroundColor: `${primaryBlue.c100}40`,
    borderColor: primaryBlue.c500,
  },
  success: {
    backgroundColor: undefined,
    borderColor: successGreen.c500,
  },
} as const;
