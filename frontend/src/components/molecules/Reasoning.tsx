"use client";

import React from "react";
import { Typography, OutlinedLightButton } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { ReasoningI } from "../organisms";
import { truncateText, getShortenedGovActionId } from "@utils";

export const Reasoning = ({ title, description, link, hash }: ReasoningI) => {
  const t = useTranslations("GovernanceAction");

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="body2" color={customPalette.neutralGray}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={400}
        color={customPalette.neutralGray}
      >
        {description}
      </Typography>
      {link && hash && (
        <Box
          display="flex"
          gap={2}
          flexDirection={{ xxs: "column", md: "row" }}
        >
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography
              variant="caption"
              fontWeight={500}
              color={customPalette.neutralGray}
            >
              {t("Link")}
            </Typography>
            <OutlinedLightButton nonInteractive={true}>
              {truncateText(link, 20)}
            </OutlinedLightButton>
          </Box>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography
              variant="caption"
              fontWeight={500}
              color={customPalette.neutralGray}
            >
              {t("Hash")}
            </Typography>
            <OutlinedLightButton nonInteractive={true}>
              {getShortenedGovActionId(hash, 10)}
            </OutlinedLightButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};
