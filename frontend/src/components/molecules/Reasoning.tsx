"use client";

import React from "react";
import { Typography, OutlinedLightButton } from "@atoms";
import { customPalette } from "@consts";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import { ReasoningI } from "../organisms";

export const Reasoning = ({ title, description, link, hash }: ReasoningI) => {
  const t = useTranslations("GovernanceAction");

  return (
    <Box display="flex" flexDirection="column" gap={1}>
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
      <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography
            variant="caption"
            fontWeight={500}
            color={customPalette.neutralGray}
          >
            {t("Link")}
          </Typography>
          <OutlinedLightButton>
            <Typography data-testid="tab-link" variant="caption">
              {link}
            </Typography>
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
          <OutlinedLightButton>
            <Typography data-testid="tab-hash" variant="caption">
              {hash}
            </Typography>
          </OutlinedLightButton>
        </Box>
      </Box>
    </Box>
  );
};