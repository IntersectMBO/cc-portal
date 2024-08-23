"use client";
import React from "react";

import { Box, Grid, IconButton, SwipeableDrawer } from "@mui/material";

import { ICONS, IMAGES } from "@consts";

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
            justifyContent: "space-between",
            py: 3,
          }}
        >
          <img height={25} src={IMAGES.logoSign} />
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            <img src={ICONS.close} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Grid container direction="column" mt={3} rowGap={rowGap}>
            {children}
          </Grid>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
