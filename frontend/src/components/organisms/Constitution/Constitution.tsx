"use client";

import { Card } from "@molecules";
import { Box, Grid } from "@mui/material";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import {
  Heading1,
  Heading2,
  NavDrawer,
  NavTitle,
  Paragraph,
  NavCard,
} from "./MDXComponents";
import { ConstitutionMetadata, ConstitutionProps } from "../types";
import { useTranslations } from "next-intl";
import { useModal } from "@/context";

export function Constitution({ constitution, metadata }: ConstitutionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState("revisions");
  const { openModal } = useModal();
  const t = useTranslations("Constitution");

  const onCompare = (target: Omit<ConstitutionMetadata, "version">) => {
    openModal({
      type: "compareConstitutionModal",
      state: {
        base: metadata[0],
        target,
      },
    });
  };
  const MDXComponents = {
    nav: ({ children }) => (
      <NavDrawer
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        top={90}
        left={0}
      >
        <Box>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginBottom: 2 }}
            gap={2}
          >
            <NavTitle
              onClick={() => setTab("revisions")}
              label={t("drawer.latestRevisions")}
              isActive={tab === "revisions"}
            />
            <NavTitle
              onClick={() => setTab("")}
              label={t("drawer.tableOfContents")}
              isActive={tab === ""}
            />
          </Grid>
        </Box>
        {tab === "revisions" ? (
          <Grid container direction="column">
            <Grid item justifyContent="flex-end">
              {metadata.map(({ title, created_date, cid }) => {
                return (
                  <NavCard
                    onClick={() => {
                      metadata[0].cid === cid
                        ? null
                        : onCompare({ title, created_date, cid });
                    }}
                    hash={cid}
                    title={title}
                    description={created_date}
                    buttonLabel={
                      metadata[0].cid === cid
                        ? t("drawer.latest")
                        : t("drawer.compare")
                    }
                    key={cid}
                  />
                );
              })}
            </Grid>
          </Grid>
        ) : (
          <Grid container direction="column">
            <Grid item justifyContent="flex-end">
              {children}
            </Grid>
          </Grid>
        )}
      </NavDrawer>
    ),
    h1: Heading1,
    h2: Heading2,
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
      <Grid my={3} item xs={10} md={isOpen ? 8 : 11}>
        <Card sx={{ px: { xs: 2, md: 7 }, py: { xs: 1, md: 6 } }}>
          <MDXRemote {...constitution} components={MDXComponents} />
        </Card>
      </Grid>
    </Grid>
  );
}
