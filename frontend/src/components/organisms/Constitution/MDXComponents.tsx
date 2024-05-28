import { customPalette, ICONS } from "@consts";
import { Typography } from "@atoms";
import { Collapse, Grid } from "@mui/material";

export const Heading1 = ({ children, id }) => (
  <Typography
    id={id}
    sx={{ marginTop: "24px", marginBottom: "24px" }}
    align="center"
    variant="headline5"
  >
    {children}
  </Typography>
);

export const Heading2 = ({ children, id }) => (
  <Typography
    id={id}
    sx={{ marginTop: "24px", marginBottom: "24px" }}
    align="center"
    variant="body1"
  >
    {children}
  </Typography>
);

export const Paragraph = ({ children }) => (
  <Typography sx={{ lineHeight: "18px" }} variant="caption">
    {children}
  </Typography>
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
        unmountOnExit
      >
        {children}
      </Collapse>
    </Grid>
  );
};
