"use client";
import { CONSTITUTION_SIDEBAR_TABS } from "@/constants";
import { useAppContext, useModal } from "@/context";
import { Grid } from "@mui/material";
import { isAnyAdminRole } from "@utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { NotFound } from "../NotFound";
import { PageTitleTabs } from "../PageTitleTabs";
import { ConstitutionMetadata } from "../types";
import { NavCard } from "./MDXComponents";

export const ConstitutionSidebar = ({ tableOfContents, metadata }) => {
  const { openModal } = useModal();
  const { userSession } = useAppContext();
  const [tab, setTab] = useState("contents");
  const t = useTranslations("Constitution");

  const onCompare = (
    target: Omit<ConstitutionMetadata, "version" | "url" | "blake2b">
  ) => {
    openModal({
      type: "compareConstitutionModal",
      state: {
        base: metadata[0],
        target
      }
    });
  };
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        padding={2}
        pt={{ xxs: 0, md: 2 }}
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
      </Grid>
      <Grid
        container
        direction="column"
        width={{ xxs: "100%", lg: "340px" }}
        px={{ xxs: 1, md: 1 }}
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
                    buttonLabel={metadata[0].cid !== cid && t("drawer.compare")}
                    isActiveLabel={
                      metadata[0].cid === cid && t("drawer.latest")
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
          <Grid item container>
            {tableOfContents}
          </Grid>
        )}
      </Grid>
    </>
  );
};
