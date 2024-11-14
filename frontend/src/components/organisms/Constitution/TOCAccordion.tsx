"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from "@mui/material";
import { Children, useEffect, useState } from "react";
import { TocNested } from "./TOCNested";

export const TocAccordion = ({ children }) => {
  const [nestedHeading2, setNestedHeading2] = useState([]);

  useEffect(() => {
    const headings = [];
    Children.forEach(children, (child) => {
      if (Array.isArray(child.props.children[1]?.props.children)) {
        child.props.children[1].props.children.forEach((subChild) => {
          if (subChild.props.className?.includes("toc-item-h2")) {
            headings.push(subChild);
          }
        });
      }
    });
    setNestedHeading2(headings);
  }, [children]);
  return (
    <>
      {Children.map(children, (child) => (
        <>
          {Array.isArray(child.props.children) ? (
            <Accordion
              elevation={0}
              sx={{
                boxShadow: "none",
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
                  padding: 0,
                  "& a": {
                    "&:active": {
                      pointerEvents: "none" // disables the href activation on click but keep tooltip showing
                    }
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
                      minHeight: "56px",
                      margin: "0",
                      "&:a": {
                        margin: "auto"
                      }
                    }
                  }}
                >
                  {Array.isArray(child.props.children[1]?.props.children)
                    ? child.props.children[1].props.children.map((subChild) =>
                        subChild.props.className.includes("toc-item-h2")
                          ? null // Filter out toc-item-h2 as we are already capturing it in the state
                          : subChild
                      )
                    : child.props.children[1]?.props.children}
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : !child.props?.className.includes("toc-item-h4") ? (
            <AccordionDetails
              sx={{
                borderRadius: "30px",
                minHeight: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                listStyleType: "none",
                padding: 0,
                width: "100%",

                "& li": {
                  display: "flex",
                  alignItems: "center"
                }
              }}
            >
              {child}
            </AccordionDetails>
          ) : (
            <AccordionDetails
              sx={{
                listStyleType: "none",
                padding: 0,
                height: "56px",
                "& li": {
                  minHeight: "56px"
                }
              }}
            >
              {child}
            </AccordionDetails>
          )}
        </>
      ))}
      <TocNested headings={nestedHeading2} />
    </>
  );
};
