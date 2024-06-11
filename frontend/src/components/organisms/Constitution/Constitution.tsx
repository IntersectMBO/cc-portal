"use client";

import { Card } from "@molecules";
import { Box, Divider, Grid } from "@mui/material";
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
import { Footer } from "../Footer";
import { customPalette } from "@consts";
import { ContentWrapper } from "@/components/atoms";

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
        top={{ xs: 75, md: 90 }}
        left={0}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          padding={2}
          sx={{ marginBottom: 2 }}
          flexWrap="nowrap"
        >
          <Grid item xs={12} md="auto">
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
          <Grid
            item
            xs={6}
            justifySelf="flex-end"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <Divider
              color={customPalette.lightBlue}
              orientation="horizontal"
              flexItem={true}
              sx={{
                height: "1px",
                width: "100%",
                alignSelf: "center",
              }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          width={{ xs: "100%", md: "400p", lg: "450px" }}
          px={{ xs: 1, md: 2 }}
        >
          {tab === "revisions" ? (
            <Grid item justifyContent="flex-end" px={{ xs: 1, md: 0 }}>
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
          ) : (
            <Grid item justifyContent="flex-end">
              {children}
            </Grid>
          )}
        </Grid>
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
      position="relative"
      justifyContent="flex-end"
    >
      <Grid mt={3} item xs={10} md={isOpen ? 8 : 11}>
        <ContentWrapper>
          <Box px={{ xs: 2, md: 5 }}>
            <Card sx={{ px: { xs: 2, md: 7 }, py: { xs: 1, md: 6 } }}>
              <MDXRemote {...constitution} components={MDXComponents} />
            </Card>
          </Box>
        </ContentWrapper>
        <Footer />
      </Grid>
    </Grid>
  );
}
