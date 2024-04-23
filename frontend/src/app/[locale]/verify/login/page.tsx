"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@consts";
import { loginAuthCallback, decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";
import { useAppContext } from "@context";

export default function VerifyLogin({ params: { locale }, searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  useEffect(() => {
    const verifyToken = async (token: string) => {
      try {
        const response = await loginAuthCallback(token);
        const session = await decodeUserToken();
        setUserSession(session);

        if (isAnyAdminRole(response.user.role)) {
          router.push(`/${locale}/${PATHS.admin.dashboard}`);
        } else {
          router.push(PATHS.constitution);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push(PATHS.home);
      }
    };

    if (searchParams && searchParams.token) {
      verifyToken(searchParams.token);
    }
  }, []);

  return (
    <Box height="100vh">
      <Loading />
    </Box>
  );
}
