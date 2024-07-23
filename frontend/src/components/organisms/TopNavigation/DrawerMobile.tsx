"use client";
import React from "react";

import { Box, Grid, IconButton, SwipeableDrawer } from "@mui/material";

import { ICONS, IMAGES } from "@consts";

export const DrawerMobile = ({ isDrawerOpen, setIsDrawerOpen, children }) => {
  return (
    <SwipeableDrawer
      anchor="right"
      onClose={() => setIsDrawerOpen(false)}
      onOpen={() => setIsDrawerOpen(true)}
      open={isDrawerOpen}
      PaperProps={{
        sx: { width: "100%" },
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
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <img src={ICONS.close} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Grid container direction="column" mt={6} rowGap={4}>
            {children}
          </Grid>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
