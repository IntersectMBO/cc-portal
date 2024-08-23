"use client";
import { CONSTITUTION_SIDEBAR_TABS, customPalette } from "@/constants";
import { Divider, Grid } from "@mui/material";
import { NotFound } from "../NotFound";
import { PageTitleTabs } from "../PageTitleTabs";
import { ConstitutionMetadata } from "../types";
import { isAnyAdminRole } from "@utils";
import { useAppContext, useModal } from "@/context";
import { NavCard } from "./MDXComponents";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const ConstitutionSidebar = ({ tableOfContents, metadata }) => {
  const { openModal } = useModal();
  const { userSession } = useAppContext();
  const [tab, setTab] = useState("revisions");
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

  return (
    <>
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
        pb={{ xxs: 4, md: 2 }}
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
            {tableOfContents}
          </Grid>
        )}
      </Grid>
    </>
  );
};
