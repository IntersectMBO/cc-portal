"use client";
import {
  customPalette,
  cyan,
  errorRed,
  fadedPurple,
  orange,
  poppins,
  primaryBlue,
  progressYellow,
  successGreen
} from "@/constants";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
  interface Palette {
    accentOrange: string;
    accentYellow: string;
    boxShadow1: string;
    boxShadow2: string;
    highlightBlue: string;
    inputRed: string;
    negativeRed: string;
    neutralGray: string;
    orangeDark: string;
    neutralWhite: string;
    positiveGreen: string;
    primaryBlue: string;
    secondaryBlue: string;
    specialCyan: string;
    specialCyanBorder: string;
    lightBlue: string;
    textBlack: string;
    textGray: string;
    lightOrange: string;
    fadedPurple: string;
  }
}

export type Theme = typeof theme;

export const theme = createTheme({
  breakpoints: {
    values: {
      xxs: 0,
      xs: 375,
      sm: 425,
      md: 769,
      lg: 1025,
      xl: 1441
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          bgcolor: "white",
          borderColor: "#6F99FF",
          border: 1,
          borderRadius: 50,
          padding: "8px 16px",
          width: "100%"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: "none"
        },
        outlined: ({ theme }) => ({
          borderColor: theme.palette.lightBlue
        })
      }
    },
    MuiChip: {
      variants: [
        {
          props: { color: "default", variant: "filled" },
          style: {
            backgroundColor: fadedPurple.c100
          }
        },
        {
          props: { color: "success", variant: "filled" },
          style: {
            backgroundColor: successGreen.c200,
            color: successGreen.c700
          }
        },
        {
          props: { color: "error", variant: "filled" },
          style: {
            backgroundColor: errorRed.c100,
            color: errorRed.c500
          }
        },
        {
          props: { color: "warning", variant: "filled" },
          style: {
            backgroundColor: progressYellow.c200,
            color: orange.c700
          }
        },
        {
          props: { color: "info", variant: "filled" },
          style: {
            backgroundColor: cyan.c100,
            color: cyan.c500
          }
        }
      ],
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
          height: 28
        },
        filledPrimary: {
          backgroundColor: primaryBlue.c100,
          color: primaryBlue.c500
        },
        filledSecondary: {
          backgroundColor: orange.c100,
          color: orange.c600
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  },
  typography: {
    fontFamily: poppins.style.fontFamily,
    allVariants: {
      color: "#242232",
      fontFamily: poppins.style.fontFamily
    }
  },
  palette: customPalette
});

theme.shadows[1] =
  "0px 1px 2px 0px rgba(0, 51, 173, 0.08), 0px 1px 6px 1px rgba(0, 51, 173, 0.15)";
theme.shadows[2] =
  "0px 1px 2px 0px rgba(0, 51, 173, 0.08), 0px 2px 10px 2px rgba(0, 51, 173, 0.15)";
theme.shadows[3] =
  "0px 1px 3px 0px rgba(0, 51, 173, 0.08), 0px 4px 12px 3px rgba(0, 51, 173, 0.15)";
theme.shadows[4] =
  "0px 2px 3px 0px rgba(0, 51, 173, 0.08), 0px 6px 14px 4px rgba(0, 51, 173, 0.15)";
theme.shadows[5] =
  "0px 4px 4px 0px rgba(0, 51, 173, 0.08), 0px 8px 20px 6px rgba(0, 51, 173, 0.15)";

export default theme;
