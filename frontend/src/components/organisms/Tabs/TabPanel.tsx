import * as React from "react";
import Box from "@mui/material/Box";
import { customPalette } from "@/constants";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          padding={1.5}
          border={1}
          borderColor={customPalette.lightBlue}
          borderRadius="16px"
          display="flex"
        >
          {children}
        </Box>
      )}
    </div>
  );
}
