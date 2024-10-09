"use client";

import { Button } from "@/components/atoms";
import { useAppContext, useModal } from "@/context";
import { isSuperAdminRole } from "@utils";
import { useTranslations } from "next-intl";
import { OpenDeleteUserModalState } from "../types";

export function UserListStatusDeleteButton({ userId }: { userId: string }) {
  const { userSession } = useAppContext();
  const isSuperAdmin = isSuperAdminRole(userSession.role);
  if (!isSuperAdmin) return null;
  const { openModal } = useModal<OpenDeleteUserModalState>();
  const deleteUser = () => {
    openModal({
      type: "deleteUser",
      state: {
        sAdminId: userSession.userId,
        userId
      }
    });
  };
  const t = useTranslations("UsersList");

  return (
    <Button
      size="small"
      onClick={deleteUser}
      variant="text"
      sx={{ fontSize: 12, color: "#8E908E" }}
    >
      {t("deleteUser")}
    </Button>
  );
}
