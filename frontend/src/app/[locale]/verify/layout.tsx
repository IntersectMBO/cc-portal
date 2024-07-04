import { decodeUserToken } from "@/lib/api";
import { getRoleBasedHomeRedirectURL } from "@utils";
import { Box } from "@mui/material";
import { redirect } from "next/navigation";
import React from "react";
import { PATHS } from "@consts";

async function VerifyLayout({ children }) {
  const user = await decodeUserToken();

  // Log out the current user session if another verification attempt is made while already logged in
  if (user) {
    const redirectURL = getRoleBasedHomeRedirectURL(user.role);
    redirect(`${PATHS.logout}?redirectURL=${redirectURL}`);
  }
  return <Box>{children}</Box>;
}

export default VerifyLayout;
