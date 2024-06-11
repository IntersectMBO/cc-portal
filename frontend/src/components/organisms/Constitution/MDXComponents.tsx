import { Card, CopyCard } from "@/components/molecules";
import { customPalette, ICONS } from "@/constants";
import { getShortenedGovActionId } from "@utils";
import { Button, CopyButton, OutlinedLightButton, Typography } from "@atoms";
import { Box, Collapse, Grid } from "@mui/material";
import React, { ReactNode } from "react";

export const Heading1 = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => (
  <Typography
    id={id}
    sx={{ marginTop: "24px", marginBottom: "24px" }}
    align="center"
    variant="headline5"
  >
    {children}
  </Typography>
);

export const Heading2 = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => (
  <Typography
    id={id}
    sx={{ marginTop: "24px", marginBottom: "24px" }}
    align="center"
    variant="body1"
  >
    {children}
  </Typography>
);

export const Paragraph = ({ children }: { children: ReactNode }) => (
  <Typography sx={{ lineHeight: "18px" }} variant="caption">
    {children}
  </Typography>
);

export const NavTitle = ({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <Button variant="text" size="small" onClick={onClick}>
      <Typography
        fontWeight={isActive ? 500 : 400}
        variant="body1"
        sx={{ marginRight: 1, whiteSpace: "nowrap" }}
      >
        {label}
      </Typography>
    </Button>
  );
};

export const NavDrawer = ({
  children,
  onClick,
  isOpen,
  left = 0,
  top = { xs: 75, md: 90 },
}: {
  children: ReactNode;
  onClick: () => void;
  isOpen: boolean;
  left: number;
  top: { xs: number; md: number };
}) => {
  return (
    <Grid
      position="fixed"
      left={left}
      top={top}
      item
      px={3}
      py={2}
      sx={{
        height: { xs: "90vh", md: "88vh" },
        backgroundColor: customPalette.arcticWhite,
        "& ol.toc-level-1": {
          paddingInlineStart: 0,
        },
        "& li": {
          listStyle: "none",
          "& a": {
            textDecoration: "none",
            textAlign: "left",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "24px",
            color: customPalette.textBlack,
          },
        },
      }}
    >
      <Grid
        sx={{ cursor: "pointer" }}
        item
        container
        justifyContent={isOpen ? "flex-end" : "center"}
        pr={isOpen ? 3 : 0}
      >
        <img
          src={isOpen ? ICONS.arrowLeft : ICONS.arrowRight}
          onClick={onClick}
        />
      </Grid>
      <Collapse
        sx={{
          height: { xs: "90vh", md: "80vh" },
          overflow: "scroll",
          background: "#FBFBFF",
        }}
        in={isOpen}
        timeout="auto"
        easing="enter"
        orientation="horizontal"
        collapsedSize={20}
      >
        {isOpen && <>{children}</>}
      </Collapse>
    </Grid>
  );
};

export const NavCard = ({ onClick, title, description, buttonLabel, hash }) => (
  <Box mb={2}>
    <Card sx={{ px: 3, py: 2 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems={{ lg: "center" }}
      >
        <Grid item xs={6} lg={"auto"}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{description}</Typography>
        </Grid>
        <Grid item xs={6} lg="auto">
          <Box
            display="flex"
            alignItems={{ xs: "center" }}
            justifyContent={{ xs: "flex-end" }}
          >
            <Box
              px={2.25}
              py={0.75}
              border={1}
              borderColor={customPalette.lightBlue}
              borderRadius={100}
              display="flex"
              flexWrap="nowrap"
              gap={1}
            >
              <CopyButton size={14} text={hash} />
              <Typography variant="caption">
                {getShortenedGovActionId(hash)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} lg="auto" mt={{ xs: 2, md: 0 }}>
          <Button
            sx={{ width: "100%" }}
            size="medium"
            onClick={onClick}
            variant="outlined"
          >
            {buttonLabel}
          </Button>
        </Grid>
      </Grid>
    </Card>
  </Box>
);
