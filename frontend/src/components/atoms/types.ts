import { ChangeEvent } from "react";
import {
  ButtonProps as MUIButtonProps,
  CheckboxProps as MUICheckboxProps,
  InputBaseProps,
  TypographyProps as MUITypographyProps,
  TextareaAutosizeProps,
  SxProps,
} from "@mui/material";

export type ButtonProps = Omit<MUIButtonProps, "size"> & {
  size?: "small" | "medium" | "large" | "extraLarge";
};

export type TypographyProps = Pick<
  MUITypographyProps,
  "color" | "lineHeight" | "sx" | "align"
> & {
  children?: React.ReactNode;
  fontSize?: number;
  fontWeight?: 400 | 500 | 600 | 700;
  variant?:
    | "headline1"
    | "headline2"
    | "headline3"
    | "headline4"
    | "headline5"
    | "title1"
    | "title2"
    | "body1"
    | "body2"
    | "caption";
};
