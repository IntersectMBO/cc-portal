"use client";
import React, { useEffect, useMemo } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { cookieStore, PATHS } from "@consts";
import { loginAuthCallback, decodeUserToken } from "@/lib/api";
import { getRoleBasedHomeRedirectURL } from "@utils";
import { useAppContext } from "@context";
import Cookies from "js-cookie";
import { useSnackbar } from "@/context/snackbar";
import { useTranslations } from "next-intl";

export default function VerifyLogin({ searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  const { addErrorAlert } = useSnackbar();
  const accessToken = useMemo(() => Cookies.get(cookieStore.token), []);
  const t = useTranslations();
  let errorAlertShown = false;

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

    if (accessToken && !errorAlertShown) {
      errorAlertShown = true;
      addErrorAlert(t("General.errors.sessionExists"), 5000);
      return router.push(PATHS.logout);
    } else if (searchParams && searchParams.token) {
      verifyToken(searchParams.token);
    } else {
      router.push(PATHS.home);
    }
  }, [searchParams, accessToken, errorAlertShown]);

  return (
    <Box height="100vh">
      <Loading />
    </Box>
  );
}
