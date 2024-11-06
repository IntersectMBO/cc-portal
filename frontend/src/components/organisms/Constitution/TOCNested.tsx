import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

//used to render when h2 are nested inside h3 in doc
export const TocNested = ({ headings }) => {
  return headings.map((child) => (
    <>
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
        <AccordionDetails
          sx={{
            listStyleType: "none",
            padding: "0 16px",

            "& li": {
              minHeight: "56px",
              padding: "0 16px"
            }
          }}
        >
          {child.props.children[1].props.children}
        </AccordionDetails>
      </Accordion>
    </>
  ));
};
