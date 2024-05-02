import { Box } from "@mui/material";
import React from "react";

async function DashboardLayout({ children }) {
  return <Box mb={10}>{children}</Box>;
}

export default DashboardLayout;
