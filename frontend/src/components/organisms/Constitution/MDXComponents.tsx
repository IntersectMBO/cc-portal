import { Card, CopyCard } from "@/components/molecules";
import { customPalette, ICONS } from "@/constants";
import { getShortenedGovActionId } from "@utils";
import { Button, CopyButton, OutlinedLightButton, Typography } from "@atoms";
import { Box, Collapse, Grid } from "@mui/material";
import { ReactNode } from "react";

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
    <Grid item>
      <Button
        sx={{ px: 2, py: 0.75 }}
        onClick={onClick}
        variant={isActive ? "outlined" : "text"}
      >
        <Typography fontWeight={400} variant="body1" sx={{ marginRight: 1 }}>
          {label}
        </Typography>
      </Button>
    </Grid>
  );
};

export const NavDrawer = ({
  children,
  onClick,
  isOpen,
  left = 0,
  top = 90,
}: {
  children: ReactNode;
  onClick: () => void;
  isOpen: boolean;
  left: number;
  top: number;
}) => {
  return (
    <Grid
      position="fixed"
      left={left}
      top={top}
      item
      px={2}
      py={2}
      sx={{
        height: { xs: "90vh", md: "80vh" },
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
        sx={{ paddingLeft: { xs: 1, md: 3 }, paddingRight: { xs: 1, md: 3 } }}
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
    <Card sx={{ padding: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{description}</Typography>
        </Grid>
        <Grid item>
          <Box display="flex">
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
        <Grid item>
          <Button onClick={onClick} variant="outlined">
            {buttonLabel}
          </Button>
        </Grid>
      </Grid>
    </Card>
  </Box>
);
