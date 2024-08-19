"use client";

import { Card } from "@molecules";
import { Box, Divider, Grid } from "@mui/material";
import { MDXRemote } from "next-mdx-remote";
import { useState } from "react";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListItem,
  NavDrawer,
  Paragraph,
  NavCard,
} from "./MDXComponents";
import { ConstitutionMetadata, ConstitutionProps } from "../types";
import { useTranslations } from "next-intl";
import { useAppContext, useModal } from "@/context";
import { Footer } from "../Footer";
import { CONSTITUTION_SIDEBAR_TABS, customPalette } from "@consts";
import { ContentWrapper } from "@/components/atoms";
import { NotFound } from "../NotFound";
import { PageTitleTabs } from "../PageTitleTabs";
import { isAnyAdminRole } from "@utils";

export function Constitution({ constitution, metadata }: ConstitutionProps) {
  const { userSession } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState("revisions");
  const { openModal } = useModal();
  const t = useTranslations("Constitution");

  const onCompare = (
    target: Omit<ConstitutionMetadata, "version" | "url" | "blake2b">
  ) => {
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
        top={{ xxs: 75, md: 90 }}
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
          <Grid item xxs={12} md="auto">
            <PageTitleTabs
              onChange={(tab) => setTab(tab.value)}
              tabs={CONSTITUTION_SIDEBAR_TABS}
              selectedValue={tab}
              sx={{ fontSize: { xxs: 16 } }}
            />
          </Grid>
          <Grid
            item
            xxs={6}
            justifySelf="flex-end"
            pl={1}
            sx={{ display: { xxs: "none", md: "flex" } }}
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
          width={{ xxs: "100%", md: "400p", lg: "450px" }}
          px={{ xxs: 1, md: 2 }}
        >
          {tab === "revisions" ? (
            <Grid item justifyContent="flex-end" px={{ xxs: 1, md: 0 }}>
              {metadata ? (
                metadata.map(({ title, created_date, cid, blake2b, url }) => {
                  return (
                    <NavCard
                      onClick={() => {
                        metadata[0].cid === cid
                          ? null
                          : onCompare({ title, created_date, cid });
                      }}
                      hash={blake2b}
                      title={title}
                      description={created_date}
                      buttonLabel={
                        metadata[0].cid === cid
                          ? t("drawer.latest")
                          : t("drawer.compare")
                      }
                      url={
                        userSession &&
                        isAnyAdminRole(userSession?.role) &&
                        userSession?.permissions.includes(
                          "add_constitution_version"
                        )
                          ? url
                          : null
                      }
                      key={cid}
                    />
                  );
                })
              ) : (
                <NotFound
                  height="auto"
                  title="constitutionMetadata.title"
                  description="constitutionMetadata.description"
                  sx={{ width: "100%" }}
                />
              )}
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
    h3: Heading3,
    p: Paragraph,
    li: ListItem,
    code: Code,
  };

  return (
    <Grid
      data-testid="constitution-page-wrapper"
      container
      position="relative"
      justifyContent="flex-end"
      flex={1}
    >
      <Grid mt={3} item xxs={10} md={isOpen ? 8 : 11} display="flex">
        <Box display="flex" flexDirection="column" flex={1}>
          <ContentWrapper>
            <Box px={{ xxs: 2, md: 5 }}>
              <Card sx={{ px: { xxs: 2, md: 7 }, py: { xxs: 1, md: 6 } }}>
                <MDXRemote {...constitution} components={MDXComponents} />
              </Card>
            </Box>
          </ContentWrapper>
          <Footer />
        </Box>
      </Grid>
    </Grid>
  );
}
