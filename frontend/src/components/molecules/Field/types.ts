import { BoxProps, TypographyProps as MUITypographyProps } from "@mui/material";

import {
  CheckboxProps,
  FormErrorMessageProps,
  InputProps,
  TextAreaProps,
  TypographyProps,
} from "@atoms";
import { ReactElement } from "react";

export type InputFieldProps = InputProps &
  FormErrorMessageProps & {
    helpfulText?: string;
    helpfulTextStyle?: MUITypographyProps;
    label?: string | ReactElement;
    labelStyles?: TypographyProps;
    layoutStyles?: BoxProps;
  };

export type CheckboxFieldProps = CheckboxProps &
  FormErrorMessageProps & {
    label?: string;
    labelStyles?: TypographyProps;
    layoutStyles?: BoxProps;
  };

export type TextAreaFieldProps = TextAreaProps &
  FormErrorMessageProps & {
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
