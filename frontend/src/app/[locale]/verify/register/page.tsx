"use client";
import React, { useEffect, useMemo } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { cookieStore, PATHS } from "@consts";
import { registerAuthCallback, decodeUserToken } from "@/lib/api";
import { useAppContext, useModal } from "@context";
import { SignupModalState } from "@organisms";
import { getRoleBasedHomeRedirectURL, isAnyAdminRole } from "@utils";
import Cookies from "js-cookie";
import { useSnackbar } from "@/context/snackbar";
import { useTranslations } from "next-intl";

export default function VerifyRegister({ searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  const { openModal } = useModal<SignupModalState>();
  const { addErrorAlert } = useSnackbar();
  const t = useTranslations();
  const accessToken = useMemo(() => Cookies.get(cookieStore.token), []);

  useEffect(() => {
    const verifyToken = async (token: string) => {
      const response = await registerAuthCallback(token);
      if (response.error) {
        addErrorAlert(t("General.errors.somethingWentWrong"));
        router.push(PATHS.home);
      } else {
        const session = await decodeUserToken();
        setUserSession(session);
        const redirectURL = getRoleBasedHomeRedirectURL(response?.user.role);
        router.push(redirectURL);
        if (!isAnyAdminRole(session.role)) {
          openModal({
            type: "signUpModal",
            state: {
              showCloseButton: false,
              title: t("Modals.signUp.headline"),
            },
          });
        }
      }
    };

    if (accessToken) {
      addErrorAlert(t("General.errors.sessionExists"), 5000);
      return router.push(PATHS.logout);
    } else if (searchParams && searchParams.token) {
      verifyToken(searchParams.token);
    } else {
      router.push(PATHS.home);
    }
  }, [searchParams, accessToken]);

  return (
    <Box height="100vh">
      <Loading />
    </Box>
  );
}
