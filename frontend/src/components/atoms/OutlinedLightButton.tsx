"use client";

import React from "react";
import { Typography } from "@atoms";
import { customPalette } from "@consts";
import { Box } from "@mui/material";
import { BoxOwnProps } from "@mui/system";

interface Props extends BoxOwnProps {
  children: React.ReactNode;
}

export const OutlinedLightButton = ({ children, mt, ...props }: Props) => {
  return (
    <Box display="flex" mt={mt}>
      <Box
        px={2.25}
        py={0.75}
        border={1}
        borderColor={customPalette.lightBlue}
        borderRadius={100}
        display="flex"
        flexWrap="nowrap"
        gap={1}
        {...props}
      >
        {children}
      </Box>
    </Box>
  );
};
