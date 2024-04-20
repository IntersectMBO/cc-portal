"use client";

import { useCallback } from "react";
import { Controller, get } from "react-hook-form";

import { Field } from "@molecules";

import {
  ControlledCheckboxProps,
  ControlledUploadProps,
  RenderInputProps,
} from "./types";
import { ButtonProps, UploadFileButton } from "@atoms";

export const Upload = ({
  control,
  name,
  errors,
  rules,
  ...props
}: ControlledUploadProps) => {
  const errorMessage = get(errors, name)?.message as string;

  const renderInput = useCallback(
    ({ field: { value, onChange, ...field } }: RenderInputProps) => (
      <UploadFileButton
        {...props}
        {...field}
        onChange={onChange}
        value={value}
        errorMessage={errorMessage}
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
