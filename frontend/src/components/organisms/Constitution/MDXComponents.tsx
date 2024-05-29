import { customPalette, ICONS } from "@consts";
import { Typography } from "@atoms";
import { Collapse, Grid } from "@mui/material";

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
export const Heading1 = ({ children, id }) => (
  <>
    <Typography
      sx={{ marginTop: "24px", marginBottom: "24px" }}
      align="center"
      variant="headline5"
    >
      {children}
    </Typography>
    <Anchor id={id} offset="-30vh" />
  </>
);

export const Heading2 = ({ children, id }) => (
  <>
    <Typography
      sx={{ marginTop: "24px", marginBottom: "24px" }}
      align="center"
      variant="body1"
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const Heading3 = ({ children, id }) => (
  <>
    <Typography
      sx={{ marginTop: "12px", marginBottom: "12px" }}
      variant="body2"
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const Paragraph = ({ children, id }) => (
  <>
    <Typography
      sx={{ lineHeight: "18px", marginBottom: "16px" }}
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
      lineHeight: "18px",
      marginBottom: "16px",
      fontSize: "12px",
    }}
  >
    {children}
  </li>
);

export const TableOfContent = ({ children, onClick, isOpen }) => {
  return (
    <Grid
      position="fixed"
      left={0}
      top={90}
      item
      width={isOpen ? 400 : 100}
      px={2}
      py={2}
      sx={{
        height: "90vh",
        overflow: "scroll",
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
        sx={{ paddingLeft: { xs: 1, md: 3 }, paddingRight: { xs: 1, md: 3 } }}
        in={isOpen}
        timeout="auto"
        unmountOnExit
      >
        {children}
      </Collapse>
    </Grid>
  );
};
