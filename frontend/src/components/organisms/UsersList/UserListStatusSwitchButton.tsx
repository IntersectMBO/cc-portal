"use client";

import { useAppContext, useModal } from "@/context";
import { useSnackbar } from "@/context/snackbar";
import { resendRegisterEmail } from "@/lib/api";
import { UserRole, UserRoleEnum } from "@/lib/requests";
import { Button, UserStatus as UserStatusType } from "@atoms";
import { isAdminRole, isResponseErrorI, isSuperAdminRole } from "@utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { OpenSwitchStatusModalState } from "../types";

type ActionConfig = {
  buttonText: string;
  action: () => Promise<void>;
};

export default function UserListStatusSwitchButton({
  status,
  userId,
  role,
  email
}: {
  userId: string;
  status: UserStatusType;
  role: UserRole;
  email: string;
}) {
  const { userSession } = useAppContext();
  const isSuperAdmin = isSuperAdminRole(userSession.role);
  const isAdmin = isAdminRole(userSession.role);
  const router = useRouter();
  const t = useTranslations("UsersList");
  const { openModal } = useModal<OpenSwitchStatusModalState>();

  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  // super admin can switch status of admins (not users) and admin can switch status of users but not of admins
  // both super admin and admin can resend invitation
  const getActionConfig = (): ActionConfig | null => {
    if (status === "pending" && (isAdmin || isSuperAdmin)) {
      return {
        buttonText: t("resendInv"),
        action: async () => {
          const res = await resendRegisterEmail(email);
          if (!isResponseErrorI(res)) {
            addSuccessAlert(t("resendAlerts.success"));
            router.refresh();
          } else {
            addErrorAlert(res.error);
          }

          router.refresh();
        }
      };
    }

    if (status === "active" || status === "inactive") {
      const newStatus: Omit<UserStatusType, "pending"> =
        status === "active" ? "inactive" : "active";

      if (isSuperAdmin && role === UserRoleEnum.Admin) {
        return {
          buttonText: status === "active" ? t("makeInactive") : t("makeActive"),
          action: async () => {
            handleSwitchUser(newStatus);
          }
        };
      }

      if (
        isAdmin &&
        (role === UserRoleEnum.User || role === UserRoleEnum.Alumni)
      ) {
        return {
          buttonText: status === "active" ? t("makeInactive") : t("makeActive"),
          action: async () => {
            handleSwitchUser(newStatus);
          }
        };
      }
    }

    return null;
  };

  const actionConfig = getActionConfig();

  if (!actionConfig) {
    return null;
  }

  const handleSwitchUser = (newStatus: Omit<UserStatusType, "pending">) => {
    openModal({
      type: "switchUserStatus",
      state: {
        newStatus,
        userId
      }
    });
  };

  return (
    <Button
      size="small"
      onClick={actionConfig.action}
      variant="text"
      sx={{ fontSize: 12, color: "#8E908E" }}
    >
      {actionConfig.buttonText}
    </Button>
  );
}
