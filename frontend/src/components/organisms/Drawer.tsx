import { customPalette, ICONS } from "@/constants";
import { Collapse, Grid } from "@mui/material";

export const Drawer = ({ children, onClick, isOpen, left = 0, top = 90 }) => {
  return (
    <Grid
      position="fixed"
      left={left}
      top={top}
      item
      px={2}
      py={2}
      sx={{
        height: "80vh",
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
      >
        <img src={ICONS.menuIcon} onClick={onClick} />
      </Grid>
      <Collapse
        sx={{ paddingLeft: { xxs: 1, md: 3 }, paddingRight: { xxs: 1, md: 3 } }}
        in={isOpen}
        timeout="auto"
        easing="enter"
        orientation="horizontal"
        collapsedSize={20}
      >
        {children}
      </Collapse>
    </Grid>
  );
};
