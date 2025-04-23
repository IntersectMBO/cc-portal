"use client";

import { ICONS } from "@/constants";
import { useAppContext, useModal } from "@/context";
import { IconButton } from "@mui/material";
import { isSuperAdminRole } from "@utils";
import { OpenDeleteUserModalState } from "../types";

export function UserListEditRoleButton({ userId }: { userId: string }) {
  const { userSession } = useAppContext();
  const { openModal } = useModal<OpenDeleteUserModalState>();

  if (!userSession || !isSuperAdminRole(userSession.role)) return null;

  const handleEditUserRole = () => {
    openModal({
      type: "changeRole",
      state: {
        sAdminId: userSession.userId,
        userId,
      },
    });
  };

  return (
    <IconButton size="large" onClick={handleEditUserRole}>
      <img src={ICONS.editUserRole} />
    </IconButton>
  );
}
