"use client";
import React from "react";

import { Box, Grid, IconButton, SwipeableDrawer } from "@mui/material";

import { ICONS } from "@consts";

export const DrawerMobile = ({
  isDrawerOpen,
  setIsDrawerOpen,
  children,
  sx = {},
  rowGap = 4,
}) => {
  return (
    <SwipeableDrawer
      anchor="right"
      onClose={() => setIsDrawerOpen(false)}
      onOpen={() => setIsDrawerOpen(true)}
      open={isDrawerOpen}
      PaperProps={{
        sx: { width: "100%", ...sx },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: 3,
            pb: 2,
          }}
        >
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <img src={ICONS.close} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Grid container direction="column" rowGap={rowGap}>
            {children}
          </Grid>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
