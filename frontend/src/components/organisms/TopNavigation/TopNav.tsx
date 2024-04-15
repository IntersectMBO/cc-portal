"use client";
import React from "react";

import { Box, Grid } from "@mui/material";

import { NAV_ITEMS } from "@/constants";
import { Link } from "@atoms";
import { TopNavWrapper } from "./TopNavWrapper";

export const TopNav = () => {
  return (
    <TopNavWrapper>
      <Box>
        {NAV_ITEMS.map((navItem) => (
          <Grid item key={navItem.label}>
            <Link
              data-testid={navItem.dataTestId}
              label={navItem.label}
              href={navItem.href}
            />
          </Grid>
        ))}
      </Box>
    </TopNavWrapper>
  );
};
