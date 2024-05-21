"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@consts";
import { registerAuthCallback, decodeUserToken } from "@/lib/api";
import { useAppContext, useModal } from "@context";
import { SignupModalState } from "@organisms";
import { isAnyAdminRole } from "@utils";
import { useTranslations } from "next-intl";

export default function VerifyRegister({ params: { locale }, searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  const { openModal } = useModal<SignupModalState>();
  const t = useTranslations("Modals");

  useEffect(() => {
    const verifyToken = async (token: string) => {
      try {
        await registerAuthCallback(token);
        const session = await decodeUserToken();
        setUserSession(session);
        if (isAnyAdminRole(session.role)) {
          router.push(`/${locale}/${PATHS.admin.dashboard}`);
        } else {
          router.push(PATHS.home);
        }

        openModal({
          type: "signUpModal",
          state: {
            showCloseButton: false,
            title: t("signUp.headline"),
            description: t("signUp.description"),
          },
        });
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