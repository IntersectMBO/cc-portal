"use client";
import React, { useEffect } from "react";

import { Loading } from "@molecules";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { PATHS } from "@consts";
import { registerAuthCallback, decodeUserToken } from "@/lib/api";
import { useAppContext, useModal } from "@context";
import { SignupModalState } from "@organisms";

export default function VerifyRegister({ searchParams }) {
  const router = useRouter();
  const { setUserSession } = useAppContext();
  const { openModal } = useModal<SignupModalState>();

  useEffect(() => {
    const verifyToken = async (token: string) => {
      try {
        await registerAuthCallback(token);
        const session = await decodeUserToken();
        setUserSession(session);
        router.push(PATHS.home);
        openModal({
          type: "signUpModal",
          state: {
            showCloseButton: false,
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
