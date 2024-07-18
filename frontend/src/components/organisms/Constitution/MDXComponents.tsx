import { Card } from "@/components/molecules";
import { customPalette, ICONS } from "@/constants";
import { getShortenedGovActionId } from "@utils";
import { Button, CopyButton, Typography } from "@atoms";
import { Box, Collapse, Grid } from "@mui/material";
import React, { ReactNode } from "react";

const Anchor = ({ id, offset = "-20vh " }) => {
  return (
    <span
      id={id}
      style={{
        display: "block",
        position: "relative",
        top: offset,
        visibility: "hidden",
      }}
    />
  );
};

export const HeadingAnchor = ({ children, id }) => (
  <>
    {children}
    <Anchor id={id} offset="-30vh" />
  </>
);

export const Heading1 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        lineHeight: "1.25em",
        fontSize: "2em",
      }}
      variant="headline4"
    >
      {children}
    </Typography>
    <Anchor id={id} offset="-30vh" />
  </>
);

export const Heading2 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        fontWeight: 600,
        fontSize: 20,
        lineHeight: "1.25em",
      }}
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const Heading3 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        fontWeight: 600,
        fontSize: 18,
        lineHeight: "1.25em",
      }}
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const Paragraph = ({ children, id }) => (
  <>
    <Typography
      sx={{ lineHeight: "1.5", marginBottom: "16px", fontSize: "14px" }}
      variant="caption"
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const ListItem = ({ children, id }) => (
  <li
    style={{
      lineHeight: "1.5",
      marginBottom: "16px",
      fontSize: "14px",
    }}
  >
    {children}
  </li>
);

export const Code = ({ children }) => (
  <code
    style={{
      lineHeight: "1.5",
      fontSize: "14px",
      padding: ".2em .4em",
      margin: 0,
      whiteSpace: "break-spaces",
      backgroundColor: "#afb8c133",
      borderRadius: "6px",
    }}
  >
    {children}
  </code>
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
        overflow: "scroll",
        height: { xs: "95vh", md: "90vh" },
        zIndex: 1,
        backgroundColor: customPalette.arcticWhite,
        "& ol.toc-level-1": {
          paddingInlineStart: 0,

          "& li": {
            listStyle: "outside !important",
            "& a.toc-link-h1": {
              fontWeight: 600,
            },
          },
        },
        "& ol.toc-level-2": {
          margin: "10px 0px 10px 0px",
        },
        "& li": {
          marginBottom: "3px !important",
          "& a": {
            textDecoration: "none",
            textAlign: "left",
            fontSize: 14,
            fontWeight: 500,
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
