import { ChangeEvent } from "react";
import {
  CheckboxProps as MUICheckboxProps,
  InputBaseProps,
  TypographyProps as MUITypographyProps,
  TextareaAutosizeProps,
  SxProps,
} from "@mui/material";
import { ButtonProps as MUIButtonProps } from "@mui/material/Button";

export type ButtonProps = Omit<MUIButtonProps, "size"> & {
  size?: "small" | "medium" | "large" | "extraLarge";
  dataTestId?: string;
};

export type TypographyProps = Pick<
  MUITypographyProps,
  "color" | "lineHeight" | "sx" | "align" | "id"
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
  dataTestId?: string;
};

export type InputProps = InputBaseProps & {
  dataTestId?: string;
  errorMessage?: string;
};

export type SpacerProps = {
  x?: number;
  y?: number;
};

export type CheckboxProps = Omit<MUICheckboxProps, "onChange" | "value"> & {
  dataTestId?: string;
  errorMessage?: string;
  onChange: (newValue: ChangeEvent<Element> | boolean) => void;
  value: boolean;
};

export type FormErrorMessageProps = {
  errorMessage?: string;
  errorStyles?: MUITypographyProps;
};

export type FormHelpfulTextProps = {
  helpfulText?: string;
  helpfulTextStyle?: MUITypographyProps;
};

export type TextAreaProps = TextareaAutosizeProps & {
  errorMessage?: string;
};

export type InfoTextProps = {
  label: string;
  sx?: SxProps;
};

export type UserStatus = "pending" | "active" | "inactive";

export type Vote = "yes" | "no" | "abstain";
