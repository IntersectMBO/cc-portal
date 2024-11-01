import {
  Card,
  TableDivider,
  UserAvatar,
  UserBasicInfo,
  UserRole,
  UserStatus
} from "@/components/molecules";
import { useAppContext, useModal } from "@/context";
import { UserStatus as UserStatusType } from "@atoms";
import { Box, Grid } from "@mui/material";
// import { hasManageUserPermission } from "@utils";
import { OpenDeleteRoleModalState, UserListItem } from "../types";
import { UserListStatusDeleteButton } from "./UserListStatusDeleteButton";
import UserListStatusSwitchButton from "./UserListStatusSwitchButton";
export function UsersListItem({
  id,
  name,
  email,
  role,
  status,
  profile_photo_url
}: Pick<
  UserListItem,
  "id" | "name" | "email" | "role" | "status" | "profile_photo_url"
>) {
  const { userSession } = useAppContext();
  const { openModal } = useModal<OpenDeleteRoleModalState>();
  // const allowDeletingUser =
  //   status !== "inactive" &&
  //   hasManageUserPermission(role, userSession?.permissions);

  const deleteUserRole = () => {
    openModal({
      type: "deleteRole",
      state: {
        userId: id,
        status: "inactive"
      }
    });
  };

  const UserInfoColumn = () => {
    return (
      <Grid container item xxs={12} sm={10} md={10} lg="auto">
        <Grid item>
          <UserAvatar src={profile_photo_url} />
        </Grid>
        <Grid item>
          <UserBasicInfo name={name} email={email} />
        </Grid>
      </Grid>
    );
  };

  const UserRoleColumn = () => {
    return (
      <Grid
        item
        xxs={12}
        sm={12}
        md={5}
        lg={4}
        xl={3}
        display="flex"
        flexDirection="row"
        gap={3}
      >
        <TableDivider />
        <Box>
          <UserRole
            // showCloseButton={allowDeletingUser}
            roles={[role]}
            onClick={deleteUserRole}
          />
        </Box>
      </Grid>
    );
  };

  const UserStatusColumn = () => {
    return (
      <Grid
        item
        xxs={12}
        sm={12}
        md={4}
        lg={4}
        display="flex"
        flexDirection="row"
        gap={3}
      >
        <TableDivider />
        <Box width={150}>
          <UserStatus status={status as UserStatusType} />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
          <UserListStatusSwitchButton
            status={status}
            userId={id}
            role={role}
            email={email}
          />
        </Box>
      </Grid>
    );
  };

  const DeleteButtonColumn = () => {
    return (
      <Grid
        item
        xs={12}
        sm={12}
        md="auto"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <UserListStatusDeleteButton userId={id} />
      </Grid>
    );
  };

  return (
    <Grid item width="100%">
      <Card variant="default">
        <Grid container item gap={{ xxs: 3, sm: 0 }}>
          <Grid
            container
            item
            xs={12}
            md={10}
            lg={11}
            display="flex"
            alignItems="center"
            gap={{ xxs: 3 }}
          >
            <UserInfoColumn />
            <UserRoleColumn />
            <UserStatusColumn />
          </Grid>

          <DeleteButtonColumn />
        </Grid>
      </Card>
    </Grid>
  );
}
