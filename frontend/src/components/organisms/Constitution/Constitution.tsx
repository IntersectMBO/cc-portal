"use client";

import { Card } from "@molecules";
import { Grid } from "@mui/material";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Paragraph,
  TableOfContent,
} from "./MDXComponents";
import { ConstitutionProps } from "../types";

export function Constitution({ constitution }: ConstitutionProps) {
  const [isTOCOpen, setIsTOCOpen] = useState(true);

  const MDXComponents = {
    nav: ({ children }) => (
      <TableOfContent
        isOpen={isTOCOpen}
        onClick={() => setIsTOCOpen(!isTOCOpen)}
      >
        {children}
      </TableOfContent>
    ),
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
  };

  return (
    <Grid
      data-testid="constitution-page-wrapper"
      container
      px={5}
      position="relative"
      justifyContent="flex-end"
    >
      <Grid my={3} item xs={10} md={isTOCOpen ? 8 : 11}>
        <Card sx={{ px: { xs: 2, md: 7 }, py: { xs: 1, md: 6 } }}>
          <MDXRemote {...constitution} components={MDXComponents} />
        </Card>
      </Grid>
    </Grid>
  );
}
