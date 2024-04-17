import { BoxProps, TypographyProps as MUITypographyProps } from "@mui/material";

import {
  CheckboxProps,
  InputProps,
  TextAreaProps,
  TypographyProps,
} from "@atoms";

export type InputFieldProps = InputProps & {
  errorMessage?: string;
  errorStyles?: MUITypographyProps;
  helpfulText?: string;
  helpfulTextStyle?: MUITypographyProps;
  label?: string;
  labelStyles?: TypographyProps;
  layoutStyles?: BoxProps;
};

export type CheckboxFieldProps = CheckboxProps & {
  errorMessage?: string;
  errorStyles?: MUITypographyProps;
  label?: string;
  labelStyles?: TypographyProps;
  layoutStyles?: BoxProps;
};

export type TextAreaFieldProps = TextAreaProps & {
  errorMessage?: string;
  errorStyles?: MUITypographyProps;
  helpfulText?: string;
  helpfulTextStyle?: MUITypographyProps;
  label?: string;
  labelStyles?: TypographyProps;
  layoutStyles?: BoxProps;
};

export interface SeletItem {
  value: string;
  label: string;
}

export interface MultipleSelectProps extends Omit<InputFieldProps, "onChange"> {
  items: SeletItem[];
  onChange: (...event: any[]) => void;
  multiple?: boolean;
}
