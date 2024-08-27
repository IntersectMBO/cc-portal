import React from "react";

import { Card } from "@molecules";
import { Grid } from "@mui/material";
import { UserAvatar, UserBasicInfo, UserRole, UserStatus } from "@molecules";
import { UserStatus as UserStatusType } from "@/components/atoms";

export function UsersListItem({ name, email, roles, status }) {
  return (
    <Grid item mb={3}>
      <Card variant="default">
        <Grid container justifyContent="space-between">
          <Grid item>
            <Grid container>
              <Grid item xxs={12} lg="auto" mb={{ xxs: 2, lg: 0 }}>
                <Grid container flexWrap="nowrap">
                  <Grid item>
                    <UserAvatar />
                  </Grid>
                  <Grid item>
                    <UserBasicInfo name={name} email={email} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item px={{ xxs: 0, lg: 3 }}>
                <UserRole roles={roles} />
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
