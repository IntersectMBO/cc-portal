"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@consts";
import { loginAuthCallback, decodeUserToken } from "@/lib/api";
import { getRoleBasedHomeRedirectURL } from "@utils";
import { useAppContext } from "@context";

export default function VerifyLogin({ searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();

  useEffect(() => {
    const verifyToken = async (token: string) => {
      const response = await loginAuthCallback(token);
      if (response.error) {
        router.push(PATHS.home);
      } else {
        const session = await decodeUserToken();
        setUserSession(session);
        const redirectURL = getRoleBasedHomeRedirectURL(response?.user.role);
        router.push(redirectURL);
      }
    };

    if (searchParams && searchParams.token) {
      verifyToken(searchParams.token);
    } else {
      router.push(PATHS.home);
    }
  }, [searchParams]);

  return (
    <Box height="100vh">
      <Loading />
    </Box>
  );
}
