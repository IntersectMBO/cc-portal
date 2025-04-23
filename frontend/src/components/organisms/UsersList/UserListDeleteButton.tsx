"use client";

import { ICONS } from "@/constants";
import { useAppContext, useModal } from "@/context";
import { IconButton } from "@mui/material";
import { isSuperAdminRole } from "@utils";
import { OpenDeleteUserModalState } from "../types";

export function UserListDeleteButton({ userId }: { userId: string }) {
  const { userSession } = useAppContext();
  const { openModal } = useModal<OpenDeleteUserModalState>();

  if (!userSession || !isSuperAdminRole(userSession.role)) return null;

  const handleDeleteUser = () => {
    openModal({
      type: "deleteUser",
      state: {
        sAdminId: userSession.userId,
        userId,
      },
    });
  };

  return (
    <IconButton size="large" onClick={handleDeleteUser}>
      <img src={ICONS.trash} />
    </IconButton>
  );
}
