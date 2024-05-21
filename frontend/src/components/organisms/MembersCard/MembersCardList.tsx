import React from "react";
import { Box, Grid } from "@mui/material";
import { NotFound } from "../NotFound";
import { MembersCard } from "./MembersCard";
import { UserListItem } from "../types";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";

export function MembersCardList({ members }: { members: UserListItem[] }) {
  const t = useTranslations("Members");

  if (members?.length === 0 || members === undefined) {
    return <NotFound title="members.title" description="members.description" />;
  }

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Typography sx={{ paddingBottom: 4 }} variant="headline4">
        {t("title")}
      </Typography>
      <Grid container>
        {members.map((data, index) => (
          <Grid
            key={index}
            item
            xs={12}
            sm={6}
            lg={4}
            data-testid={`members-${data.id}-card`}
            sx={{
              padding: 2,
              paddingTop: 0,
            }}
          >
            <MembersCard {...data} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
