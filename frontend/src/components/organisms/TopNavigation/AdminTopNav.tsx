"use client";
import React from "react";

import { Box, Grid } from "@mui/material";

import { Button } from "@atoms";
import { TopNavWrapper } from "./TopNavWrapper";
import { useTranslations } from "next-intl";
import { useModal } from "@/context";

export const AdminTopNav = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const t = useTranslations("Navigation");
  const { openModal } = useModal();

  return (
    <TopNavWrapper>
      {isLoggedIn && (
        <Box>
          <Grid container gap={2}>
            <Button
              onClick={() =>
                openModal({
                  type: "addMember",
                })
              }
              variant="outlined"
            >
              {t("addNewMember")}
            </Button>
            <Button type="submit"> {t("uploadNewVersion")}</Button>
          </Grid>
        </Box>
      )}
    </TopNavWrapper>
  );
};
