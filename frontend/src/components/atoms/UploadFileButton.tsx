"use client";
import { Button } from "@atoms";
import { ICONS } from "@consts";
import { useState } from "react";
import { ButtonProps } from "./types";

interface UploadFileButtonProps extends Omit<ButtonProps, "onChange"> {
  onChange: (file: File) => void;
}
export const UploadFileButton = ({
  onChange,
  children,
  ...buttonProps
}: UploadFileButtonProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      setSelectedFile(file);
      onChange(file);
    }
  };

  return (
    <label htmlFor="btn-upload">
      <input
        accept="image/*"
        id="btn-upload"
        name="btn-upload"
        style={{ display: "none" }}
        type="file"
        onChange={fileChange}
      />
      <Button
        startIcon={<img src={ICONS.upload} />}
        component="span"
        {...buttonProps}
      >
        {children} {selectedFile && selectedFile.name}
      </Button>
    </label>
  );
};
