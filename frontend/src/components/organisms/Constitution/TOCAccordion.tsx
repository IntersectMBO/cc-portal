import { customPalette } from "@/constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from "@mui/material";
import React, { Children } from "react";

export const TocAccordion = ({ children }) => {
  return (
    <>
      {Children.map(children, (child) => (
        <>
          {child.props.className.includes("toc-item-h1") ? (
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
                {React.cloneElement(child.props.children[0], {
                  href: "#",
                  onClick: (e) => e.preventDefault()
                })}
              </AccordionSummary>
              <AccordionDetails>{child.props.children[1]}</AccordionDetails>
            </Accordion>
          ) : (
            <Box
              sx={{
                lineHeight: "56px"
              }}
            >
              {child.props.children}
            </Box>
          )}
        </>
      ))}
    </>
  );
};
