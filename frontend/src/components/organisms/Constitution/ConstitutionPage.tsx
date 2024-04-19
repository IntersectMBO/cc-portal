import { Grid } from "@mui/material";
import { ConstitutionPageProps } from "../types";

export default function ConstitutionPage({ content }: ConstitutionPageProps) {
  return (
    <Grid
      data-testid="constitution-page"
      item
      xxs={12}
      lg={6}
      sx={{
        px: { xxs: 4, md: 7 },
        py: { xxs: 2, md: 6 },
        boxShadow: "0px 2px 10px 2px rgba(0, 51, 173, 0.15)",
        fontSize: 12,
        fontWeight: 400,
        lineHeight: "18px",
        "& h1": {
          textAlign: "center",
          fontSize: 33,
          fontWeight: 500,
          lineHeight: "39px",
        },
        "& h2": {
          textAlign: "center",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: "39px",
        },
      }}
    >
      {content}
    </Grid>
  );
}
