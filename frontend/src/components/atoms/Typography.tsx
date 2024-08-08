import React from "react";

import { Typography as MUITypography } from "@mui/material";
import { TypographyProps } from "./types";

export const Typography = ({
  color,
  variant = "body1",
  dataTestId,
  ...props
}: TypographyProps) => {
  const fontSize = {
    headline1: 100,
    headline2: 57,
    headline3: 36,
    headline4: 32,
    headline5: 28,
    title1: 24,
    title2: 22,
    body1: 16,
    body2: 14,
    caption: 12,
  }[variant];

  const fontSizeXS = {
    headline1: 46,
    headline2: 46,
    headline3: 36,
    headline4: 24,
    headline5: 20,
    title1: 20,
    title2: 20,
    body1: 18,
    body2: 14,
    caption: 12,
  }[variant];

  const fontWeight = {
    headline1: 600,
    headline2: 700,
    headline3: 400,
    headline4: 600,
    headline5: 500,
    title1: 400,
    title2: 500,
    body1: 600,
    body2: 500,
    caption: 400,
  }[variant];

  const lineHeight = {
    headline1: "110px",
    headline2: "57px",
    headline3: "44px",
    headline4: "40px",
    headline5: "36px",
    title1: "32px",
    title2: "28px",
    body1: "24px",
    body2: "20px",
    caption: "16px",
  }[variant];

  return (
    <MUITypography
      color={color}
      fontSize={{ xxs: fontSizeXS, md: fontSize }}
      fontWeight={fontWeight}
      lineHeight={lineHeight}
      data-testid={dataTestId}
      {...props}
    >
      {props.children}
    </MUITypography>
  );
};
