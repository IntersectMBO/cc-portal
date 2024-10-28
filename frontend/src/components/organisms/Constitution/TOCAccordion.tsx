import { customPalette } from "@/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from "@mui/material";
import { Children } from "react";

export const TocAccordion = ({ children }) => {
  return (
    <>
      {Children.map(children, (child) => (
        <>
          {child.props.className.includes("toc-item-h2") ? (
            <Accordion
              elevation={0}
              sx={{
                boxShadow: "none",
                padding: 0,
                "&:before": {
                  display: "none"
                },
                width: "100%"
              }}
              disableGutters
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderRadius: "30px",
                  minHeight: "56px",
                  "&:hover": {
                    backgroundColor: customPalette.accordionBg
                  },
                  "&.Mui-expanded": {
                    backgroundColor: customPalette.accordionBg
                  }
                }}
              >
                {child.props.children[0]}
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    flexDirection: "column",
                    listStyleType: "none",
                    padding: "0 16px",
                    "& li": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      minHeight: "56px"
                    }
                  }}
                >
                  {child.props.children[1].props.children}
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Accordion
              elevation={0}
              sx={{
                boxShadow: "none",
                padding: 0,
                "&:before": {
                  display: "none"
                },
                width: "100%"
              }}
              disableGutters
            >
              <Box
                sx={{
                  borderRadius: "30px",
                  minHeight: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                  listStyleType: "none",
                  padding: "0 16px",
                  "&:hover": {
                    backgroundColor: customPalette.accordionBg
                  }
                }}
              >
                {child}
              </Box>
            </Accordion>
          )}
        </>
      ))}
    </>
  );
};
