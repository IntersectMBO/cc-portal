"use client";
import { Button } from "@atoms";
import { ICONS } from "@consts";
import { Box, IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { FormErrorMessage } from "./FormErrorMessage";
import { ButtonProps, FormErrorMessageProps } from "./types";

interface UploadFileButtonProps extends Omit<ButtonProps, "onChange"> {
  onChange: (file: File | null) => void;
  accept?: string;
  dataTestId?: string;
}

export const UploadFileButton = ({
  onChange,
  children,
  errorMessage,
  errorStyles,
  name,
  value,
  accept = "image/jpeg",
  dataTestId,
  ...buttonProps
}: UploadFileButtonProps & FormErrorMessageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onChange(file);
      e.target.value = "";
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedFile(null);
    onChange(null);
  };

  useEffect(() => {
    if (!value) {
      setSelectedFile(null);
    }
  }, [value]);

  return (
    <Box>
      <input
        accept={accept}
        id="btn-upload"
        name={name}
        style={{ display: "none" }}
        type="file"
        onChange={fileChange}
        data-testid={`${dataTestId}-input`}
      />

      <Stack direction="row" spacing={"-20px"} alignItems="center">
        <label htmlFor="btn-upload">
          <Button
            startIcon={<img src={ICONS.upload} />}
            component="span"
            data-testid={`${dataTestId}-button`}
            {...buttonProps}
          >
            {selectedFile?.name || children}
          </Button>
        </label>

        {selectedFile && (
          <IconButton
            onClick={removeFile}
            size="medium"
            sx={{
              top: "-10px",
              backgroundColor: "#fff",
              border: "1px solid #ebf0ff",
              "&:hover": { backgroundColor: "#f1f3fc", borderColor: "#1233ad" },
            }}
          >
            <img src={ICONS.close} width="13px" height="13px" alt="Remove" />
          </IconButton>
        )}
      </Stack>

      <FormErrorMessage errorMessage={errorMessage} errorStyles={errorStyles} />
    </Box>
  );
};
