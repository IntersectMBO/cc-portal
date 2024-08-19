import { Card } from "@/components/molecules";
import { customPalette, ICONS } from "@/constants";
import { getShortenedGovActionId } from "@utils";
import { Button, CopyButton, Typography } from "@atoms";
import { Box, Collapse, Grid } from "@mui/material";
import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

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

export const NavDrawer = ({
  children,
  onClick,
  isOpen,
  left = 0,
  top = { xxs: 75, md: 90 },
}: {
  children: ReactNode;
  onClick: () => void;
  isOpen: boolean;
  left: number;
  top: { xxs: number; md: number };
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
        height: { xxs: "95vh", md: "90vh" },
        zIndex: 1,
        backgroundColor: customPalette.arcticWhite,
        "& ol.toc-level": {
          margin: 0,
        },
        "& ol.toc-level-1": {
          paddingInlineStart: "20px",

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
          height: { xxs: "90vh", md: "80vh" },
          overflowY: "scroll",
          background: "#FBFBFF",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
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

export const NavCard = ({
  onClick,
  title,
  description,
  buttonLabel,
  hash,
  url,
}) => (
  <Box mb={2}>
    <Card sx={{ px: 3, py: 2 }}>
      <Grid container alignItems={{ lg: "center" }}>
        <Grid item xxs={6} lg={3}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{description}</Typography>
        </Grid>
        <Grid item xxs={6} lg={4}>
          <Box
            display="flex"
            alignItems={{ xxs: "center" }}
            justifyContent={{ xxs: "flex-end" }}
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
              width="100%"
            >
              <CopyButton size={14} text={hash} />
              <Typography variant="caption">
                {getShortenedGovActionId(hash)}
              </Typography>
            </Box>
          </Box>
        </Grid>
        {url && (
          <Grid
            item
            xxs={6}
            lg={2}
            sx={{
              display: "flex",
              justifyContent: { xxs: "left", lg: "center" },
            }}
          >
            <Link
              target="_blank"
              href={url}
              style={{ cursor: "pointer", display: "flex" }}
            >
              <Image
                alt="ipfs link"
                src={ICONS.externalLink}
                width={20}
                height={20}
              />
            </Link>
          </Grid>
        )}

        <Grid item xxs={12} lg={3} mt={{ xxs: 2, md: 0 }}>
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
