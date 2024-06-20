"use client";
import React from "react";

import { Card, TableDivider } from "@molecules";
import { Box, Grid } from "@mui/material";
import { UserAvatar } from "@molecules";
import {
  Button,
  GovActionStatusPill,
  OutlinedLightButton,
  Typography,
} from "@atoms";
import { GovActionModalState, GovernanceActionTableI } from "../types";
import { customPalette, ICONS } from "@consts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { truncateText } from "@utils";
import { getProposalTypeLabel } from "@utils";
import { useModal } from "@context";

interface Props {
  govActions: GovernanceActionTableI;
}

export const GovActionTableRow = ({
  govActions: {
    abstract,
    gov_action_proposal_status,
    gov_action_proposal_id,
    gov_action_proposal_title,
    gov_action_proposal_type,
  },
}: Props) => {
  const t = useTranslations("GovernanceActions");
  const { openModal } = useModal<GovActionModalState>();
  const isDisabled = false; //todo

  const openGAModal = () => {
    openModal({
      type: "govActionModal",
      state: {
        id: gov_action_proposal_id,
      },
    });
  };

  const getActionButtonTitle = () => {
    if (gov_action_proposal_status === "UNVOTED") {
      return t("addReasoning");
    } else {
      return t("updateReasoning");
    }
  };

  const onActionClick = () => {};

  return (
    <Grid
      item
      mb={3}
      sx={{
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <Card variant="default">
        <Grid
          container
          flexDirection={{ xs: "column", xl: "row" }}
          justifyContent="space-between"
          flexWrap="nowrap"
          gap={{ xs: 0, xl: 3 }}
        >
          <Grid item xs={12} xl={10}>
            <Grid
              container
              flexDirection={{ xs: "column", lg: "row" }}
              flexWrap={{ xxs: "wrap", lg: "nowrap" }}
            >
              <Grid item xs="auto" mb={{ xxs: 2, lg: 0 }}>
                <UserAvatar src={ICONS.govAction} />
              </Grid>
              <Grid
                item
                xs="auto"
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("govAction")}
                </Typography>

                <OutlinedLightButton
                  onClick={openGAModal}
                  disabled={!gov_action_proposal_title}
                  startIcon={
                    <Image
                      alt="GA title"
                      width={12}
                      height={12}
                      src={ICONS.informationCircle}
                      style={{
                        opacity: gov_action_proposal_title ? 1 : 0.5,
                      }}
                    />
                  }
                >
                  {gov_action_proposal_title
                    ? truncateText(gov_action_proposal_title, 40)
                    : t("notAvailable")}
                </OutlinedLightButton>
              </Grid>
              <TableDivider />
              <Grid
                item
                xs="auto"
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("govActionCategoryShort")}
                </Typography>
                <OutlinedLightButton nonInteractive>
                  {getProposalTypeLabel(gov_action_proposal_type)}
                </OutlinedLightButton>
              </Grid>
              <TableDivider />
              <Grid
                item
                lg={2}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("status")}
                </Typography>
                <Box width={85}>
                  <GovActionStatusPill status={gov_action_proposal_status} />
                </Box>
              </Grid>
              <TableDivider />
              <Grid
                item
                lg={5}
                px={{ xxs: 0, lg: 1, xl: 3 }}
                py={{ xxs: 1.5, lg: 0 }}
              >
                <Typography
                  color={customPalette.neutralGray}
                  sx={{ marginBottom: 0.5 }}
                  variant="caption"
                  fontWeight={500}
                >
                  {t("abstract")}
                </Typography>
                <Typography variant="caption">
                  {abstract ? truncateText(abstract, 100) : t("notAvailable")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            xl="auto"
            textAlign={{ xs: "right", xl: "center" }}
            mt={{ xxs: 2, xl: 0 }}
          >
            <Button
              disabled={isDisabled}
              sx={{ whiteSpace: "nowrap" }}
              onClick={onActionClick}
              variant="outlined"
            >
              {getActionButtonTitle()}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};
