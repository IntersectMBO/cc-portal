import { PATHS } from "@/constants";
import { decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";
import { Box } from "@mui/material";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardLayout({ params: { locale }, children }) {
  const user = await decodeUserToken();

  if (user && !isAnyAdminRole(user?.role)) {
    redirect(`/${locale}/${PATHS.home}`);
  }
  return <Box mb={10}>{children}</Box>;
}

export default DashboardLayout;
