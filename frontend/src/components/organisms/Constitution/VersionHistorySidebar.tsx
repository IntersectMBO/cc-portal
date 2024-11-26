"use client";
import { Typography } from "@/components/atoms";
import { Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { NotFound } from "../NotFound";
import { ConstitutionMetadata, TargetConstitutionState } from "../types";
import { NavCard } from "./MDXComponents";

export type VersionHistorySidebarProps = {
  metadata?: Array<ConstitutionMetadata>;
  onCompare: ({ title, created_date, cid }: TargetConstitutionState) => void;
  ativeTarget?: string;
};

export const VersionHistorySidebar = React.memo<VersionHistorySidebarProps>(
  ({ metadata, onCompare, ativeTarget }) => {
    const t = useTranslations("Constitution");
    return (
      <>
        <Grid
          container
          alignItems="center"
          justifyContent={{ xxs: "center", md: "left" }}
          padding={1}
          pt={{ xxs: 0, md: 2 }}
          pb={{ xxs: 3 }}
          flexWrap="nowrap"
        >
          <Typography fontWeight={500}>{t("drawer.versionHistory")}</Typography>
        </Grid>
        <Grid
          container
          direction="column"
          width={{ xxs: "100%", lg: "340px" }}
          px={{ xxs: 0, md: 0 }}
        >
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
                  isActive={ativeTarget === cid}
                  isLatest={metadata[0].cid === cid && t("drawer.latest")}
                  url={url}
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
      </>
    );
  }
);
