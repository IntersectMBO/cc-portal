"use client";

import { ICONS } from "@/constants";
import { useAppContext, useModal } from "@/context";
import { useSnackbar } from "@/context/snackbar";
import { resendRegisterEmail } from "@/lib/api";
import { UserRole, UserRoleEnum } from "@/lib/requests";
import { UserStatus as UserStatusType } from "@atoms";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { isAdminRole, isResponseErrorI, isSuperAdminRole } from "@utils";
import { ReactNode } from "react";
import { useTranslations } from "use-intl";
import { OpenSwitchStatusModalState } from "../types";
type ActionConfig = {
  button: ReactNode;
  action: () => Promise<void>;
};

export default function UserListSwitchResendButton({
  status,
  userId,
  role,
  email,
}: {
  userId: string;
  status: UserStatusType;
  role: UserRole;
  email: string;
}) {
  const { userSession } = useAppContext();
  const isSuperAdmin = userSession ? isSuperAdminRole(userSession.role) : false;
  const isAdmin = userSession ? isAdminRole(userSession.role) : false;
  const t = useTranslations("UsersList");
  const { openModal } = useModal<OpenSwitchStatusModalState>();

  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  // super admin can switch status of admins (not users) and admin can switch status of users but not of admins
  // both super admin and admin can resend invitation
  const getActionConfig = (): ActionConfig | null => {
    if (status === "pending" && (isAdmin || isSuperAdmin)) {
      return {
        button: (
          <IconButton size="large" onClick={() => actionConfig?.action()}>
            <img src={ICONS.resendEmail} />
          </IconButton>
        ),
        action: async () => {
          const res = await resendRegisterEmail(email);
          if (!isResponseErrorI(res)) {
            addSuccessAlert(t("resendAlerts.success"));
          } else {
            addErrorAlert(res.error);
          }
        },
      };
    }

    if (status === "active" || status === "inactive") {
      const newStatus: Omit<UserStatusType, "pending"> =
        status === "active" ? "inactive" : "active";

      if (
        isSuperAdmin &&
        (role === UserRoleEnum.Admin ||
          role === UserRoleEnum.User ||
          role === UserRoleEnum.Alumni)
      ) {
        return {
          button: (
            <Switch
              onClick={() => actionConfig?.action()}
              checked={status === "active"}
            />
          ),
          action: async () => {
            handleSwitchUser(newStatus);
          },
        };
      }

      if (
        isAdmin &&
        (role === UserRoleEnum.User || role === UserRoleEnum.Alumni)
      ) {
        return {
          button: (
            <Switch
              onClick={() => actionConfig?.action()}
              checked={status === "active"}
            />
          ),
          action: async () => {
            handleSwitchUser(newStatus);
          },
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
        userId,
      },
    });
  };

  return <>{actionConfig.button}</>;
}
