"use client";
import { Button } from "@atoms";
import { ICONS } from "@consts";
import { Box } from "@mui/material";
import { useState } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { ButtonProps, FormErrorMessageProps } from "./types";

interface UploadFileButtonProps extends Omit<ButtonProps, "onChange"> {
  onChange: (file: File) => void;
  accept?: string;
  dataTestId?: string;
}

export const UploadFileButton = ({
  onChange,
  children,
  errorMessage,
  errorStyles,
  name,
  accept = "image/jpeg",
  dataTestId,
  ...buttonProps
}: UploadFileButtonProps & FormErrorMessageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        accept={accept}
        id="btn-upload"
        name={name}
        style={{ display: "none" }}
        type="file"
        onChange={fileChange}
        data-testid={`${dataTestId}-input`}
      />
      <Box sx={{ display: "flex" }}>
        <Button
          startIcon={<img src={ICONS.upload} />}
          component="span"
          data-testid={`${dataTestId}-button`}
          {...buttonProps}
        >
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {selectedFile && selectedFile.name ? selectedFile.name : children}
          </Box>
        </Button>
      </Box>
      <FormErrorMessage errorMessage={errorMessage} errorStyles={errorStyles} />
    </label>
  );
};
