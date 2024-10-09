"use client";

import { Button } from "@/components/atoms";
import { useAppContext, useModal } from "@/context";
import { isSuperAdminRole } from "@utils";
import { useTranslations } from "next-intl";
import { OpenDeleteUserModalState } from "../types";

export function UserListStatusDeleteButton({ userId }: { userId: string }) {
  const { userSession } = useAppContext();
  const { openModal } = useModal<OpenDeleteUserModalState>();
  const t = useTranslations("UsersList");

  if (!isSuperAdminRole(userSession.role)) return null;

  const handleDeleteUser = () => {
    openModal({
      type: "deleteUser",
      state: {
        sAdminId: userSession.userId,
        userId
      }
    });
  };

  return (
    <Button
      size="small"
      onClick={handleDeleteUser}
      variant="text"
      sx={{ fontSize: 12, color: "#8E908E" }}
    >
      {t("deleteUser")}
    </Button>
  );
}
