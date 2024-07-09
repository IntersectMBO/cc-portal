"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { decodeUserToken } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { getRoleBasedHomeRedirectURL } from "@utils";

// Logout component handles user session management on the client side:
// Authentication tokens are cleared in middleware.ts before the page is rendered
// It clears authentication state, verifies token validity,
// and redirects users based on their authentication status.
export default function Logout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetState, user, userSession } = useAppContext();
  const roleBasedRedrection = React.useMemo(
    () => getRoleBasedHomeRedirectURL(user?.role),
    []
  );
  const redirectURL = searchParams.get("redirectURL") || roleBasedRedrection;

  useEffect(() => {
    const getUsertoken = async () => {
      const token = await decodeUserToken();
      if (!token && !user && !userSession) {
        router.push(redirectURL);
        router.refresh();
      }
    };
    resetState();
    getUsertoken();
  }, [user, userSession]);

  return (
    <Box height="100vh">
      <Loading />
    </Box>
  );
}
