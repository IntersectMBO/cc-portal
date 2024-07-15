import React from "react";

import { Card, TableDivider } from "@molecules";
import { Grid } from "@mui/material";
import { UserAvatar, UserBasicInfo, UserRole, UserStatus } from "@molecules";
import { UserStatus as UserStatusType } from "@atoms";
import { OpenDeleteRoleModalState, UserListItem } from "../types";
import { useAppContext, useModal } from "@/context";
import { hasManageUserPermission } from "@utils";

export function UsersListItem({
  id,
  name,
  email,
  role,
  status,
  profile_photo_url,
}: Pick<
  UserListItem,
  "id" | "name" | "email" | "role" | "status" | "profile_photo_url"
>) {
  const { userSession } = useAppContext();
  const { openModal } = useModal<OpenDeleteRoleModalState>();
  const allowDeletingUser =
    status !== "inactive" &&
    hasManageUserPermission(role, userSession?.permissions);

  const deleteUserRole = () => {
    openModal({
      type: "deleteRole",
      state: {
        userId: id,
        status: "inactive",
      },
    });
  };

  return (
    <Grid item mb={3}>
      <Card variant="default">
        <Grid container justifyContent="space-between">
          <Grid item>
            <Grid container>
              <Grid item xxs={12} lg="auto" mb={{ xxs: 2, lg: 0 }}>
                <Grid container flexWrap="nowrap">
                  <Grid item>
                    <UserAvatar src={profile_photo_url} />
                  </Grid>
                  <Grid item>
                    <UserBasicInfo name={name} email={email} />
                  </Grid>
                </Grid>
              </Grid>
              <TableDivider />
              <Grid item px={{ xxs: 0, lg: 3 }}>
                <UserRole
                  showCloseButton={allowDeletingUser}
                  roles={[role]}
                  onClick={deleteUserRole}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            mt={{ xxs: 2, lg: 0 }}
            px={{ xxs: 0, lg: 3 }}
            sx={{ width: "150px" }}
          >
            <UserStatus status={status as UserStatusType} />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
