import { ButtonProps } from "@/components/atoms";
import {
  CheckboxFieldProps,
  InputFieldProps,
  MultipleSelectProps,
  TextAreaFieldProps,
} from "@molecules";
import {
  Control,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

export type ControlledInputProps = InputFieldProps & {
  control?: Control<any>;
  errors?: FieldErrors<any>;
  name: Path<any>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
};

interface ControlledGenericProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  name: Path<any>;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
}

export type ControlledCheckboxProps = Omit<
  CheckboxFieldProps,
  "onChange" | "value"
> &
  ControlledGenericProps;

export type RenderInputProps = {
  field: ControllerRenderProps<FieldValues, string>;
};

export type ControlledTextAreaProps = TextAreaFieldProps &
  ControlledGenericProps;

export type ControlledSelectProps = Omit<
  MultipleSelectProps,
  "onChange" | "value"
> &
  ControlledGenericProps;

export type ControlledUploadProps = Omit<ButtonProps, "onChange" | "value"> &
  ControlledGenericProps & { accept?: string; dataTestId?: string };
