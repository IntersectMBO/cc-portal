"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@consts";
import { registerAuthCallback, decodeUserToken } from "@/lib/api";
import { useAppContext, useModal } from "@context";
import { SignupModalState } from "@organisms";
import { getRoleBasedHomeRedirectURL, isAnyAdminRole } from "@utils";
import { useTranslations } from "next-intl";

export default function VerifyRegister({ searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  const { openModal } = useModal<SignupModalState>();
  const t = useTranslations("Modals");

  useEffect(() => {
    const verifyToken = async (token: string) => {
      const response = await registerAuthCallback(token);
      if (response.error) {
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
              title: t("signUp.headline"),
              description: t("signUp.description"),
            },
          });
        }
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
