import {
  Card,
  TableDivider,
  UserAvatar,
  UserBasicInfo,
  UserRole,
  UserStatus
} from "@/components/molecules";
import { UserStatus as UserStatusType } from "@atoms";
import { Box, Grid } from "@mui/material";
import { UserListItem } from "../types";
import { UserListDeleteButton } from "./UserListDeleteButton";
import UserListSwitchResendButton from "./UserListSwitchResendButton";
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
  const UserInfoColumn = () => {
    return (
      <Grid container item xxs="auto">
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
      <Grid item display="flex" flexDirection="row" gap={3}>
        <TableDivider />
        <Box>
          <UserRole roles={[role]} />
        </Box>
      </Grid>
    );
  };

  const UserStatusColumn = () => {
    return (
      <Grid item display="flex" flexDirection="row" gap={3}>
        <TableDivider />
        <Box width={150}>
          <UserStatus status={status as UserStatusType} />
        </Box>
      </Grid>
    );
  };

  return (
    <Card
      variant="default"
      sx={{
        padding: { xxs: 2, md: 3 }
      }}
    >
      <Grid
        container
        display="flex"
        justifyContent="space-between"
        flexWrap="nowrap"
      >
        <Grid
          item
          display="flex"
          alignItems="center"
          gap={{ xxs: 3 }}
          flexWrap="wrap"
        >
          <UserInfoColumn />
          <UserRoleColumn />
          <UserStatusColumn />
        </Grid>
        <Grid
          item
          display="flex"
          alignItems="center"
          flexDirection={{ md: "row", xxs: "column" }}
          gap={{ xxs: 3, md: 0 }}
        >
          <UserListDeleteButton userId={id} />
          {/* TODO: wait for BE implementation */}
          {/* <UserListEditRoleButton userId={id} /> */}

          <UserListSwitchResendButton
            status={status}
            userId={id}
            role={role}
            email={email}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
