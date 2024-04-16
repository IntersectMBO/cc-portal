import { useCallback } from "react";
import { Controller, get } from "react-hook-form";

import { Field } from "@molecules";

import { ControlledSelectProps, RenderInputProps } from "./types";

export const Select = ({
  control,
  name,
  errors,
  rules,
  items,
  ...props
}: ControlledSelectProps) => {
  const errorMessage = get(errors, name)?.message as string;

  const renderInput = useCallback(
    ({ field }: RenderInputProps) => (
      <Field.MultipleSelect
        errorMessage={errorMessage}
        name={field.name}
        onChange={field.onChange}
        value={field.value}
        items={items}
        {...props}
      />
    ),
    [errorMessage, props]
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={renderInput}
    />
  );
};
