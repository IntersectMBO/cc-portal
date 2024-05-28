"use client";

import React from "react";
import {
  ModalWrapper,
  ModalHeader,
  Typography,
  Tooltip,
  Button,
  VotePill,
  OutlinedLightButton,
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tabs } from "@organisms";
import { Reasoning } from "@/components/molecules/Reasoning";

export const PreviewReasoningModal = () => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();

  const onClick = () => {
    closeModal();
  };
  const reasonings = [
    {
      title: "Reasoning title 1",
      description:
        "Lorem ipsum dolor sit amet consectetur. Neque eleifend sed sit elementum vulputate. At diam orci mauris sit in nulla. Dui id urna aliquet et tempor est mattis. Sit ornare.",
      link: "wandjksc.com",
      hash: "sdfsdgsdbhs",
    },
    {
      title: "Reasoning title 2",
      description:
        "Lorem ipsum dolor sit amet consectetur. Neque eleifend sed sit elementum vulputate. At diam orci mauris sit in nulla. Dui id urna aliquet et tempor est mattis. Sit ornare.",
      link: "wandjksc.com",
      hash: "sdfsdgsdbhs",
    },
    {
      title: "Reasoning title 3",
      description:
        "Lorem ipsum dolor sit amet consectetur. Neque eleifend sed sit elementum vulputate. At diam orci mauris sit in nulla. Dui id urna aliquet et tempor est mattis. Sit ornare.",
      link: "wandjksc.com",
      hash: "sdfsdgsdbhs",
    },
  ];

  const tabs2 = reasonings.map((item, i) => {
    return {
      label: `Reasoning ${i + 1}`,
      Component: (
        <Reasoning
          title={item.title}
          description={item.description}
          link={item.link}
          hash={item.hash}
        />
      ),
    };
  });

  return (
    <ModalWrapper dataTestId="preview-reasoning-modal" sx={{ padding: 0 }}>
      <ModalHeader sx={{ px: 3, py: 1, mb: 0 }}>
        <Box>
          <img
            width={64}
            data-testid="modal-icon"
            alt="icon"
            src={IMAGES.pastelAddMember}
          />
        </Box>
        {t("previewReasoning.headline")}
      </ModalHeader>
      <Typography
        sx={{ px: 3 }}
        variant="body2"
        fontWeight={400}
        color={customPalette.textGray}
      >
        {t("previewReasoning.description")}
      </Typography>

      <Box
        sx={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
        pt={1.5}
        pb={3}
        px={{ xs: 2.25, md: 3 }}
      >
        <Tabs tabs={tabs2} />
        <Box mt={3}>
          <Typography color="neutralGray" variant="caption">
            {t("previewReasoning.governanceActionId")}
          </Typography>
          <OutlinedLightButton>
            <Typography
              data-testid={`${"proposalTypeNoEmptySpaces"}-id`} //todo
              variant="caption"
            >
              govaction_7778...8675 {/** todo getShortenedGovActionId */}
            </Typography>
          </OutlinedLightButton>
        </Box>
        <Box mt={3} data-testid="governance-action-type">
          <Typography color="neutralGray" variant="caption">
            {t("previewReasoning.governanceActionCategory")}
          </Typography>
          <OutlinedLightButton>
            <Typography
              data-testid={`${"proposalTypeNoEmptySpaces"}-type`} //todo proposalTypeNoEmptySpaces
              variant="caption"
            >
              Category 1 {/**todo getProposalTypeLabel */}
            </Typography>
          </OutlinedLightButton>
        </Box>
        <Box mt={3}>
          <Typography color="neutralGray" variant="caption">
            {t("previewReasoning.voted")}
          </Typography>
          <Box display="flex" mt={0.25}>
            <VotePill vote="yes" />
          </Box>
        </Box>
      </Box>

      <Box
        bgcolor="#D6E2FF80"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        py={0.75}
      >
        <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
          {t("previewReasoning.submissionDate")}
        </Typography>
        <Typography
          fontWeight={600}
          sx={{ flexWrap: "nowrap" }}
          variant="caption"
        >
          28th May 2023 {/** formatDisplayDate */}
        </Typography>
        <Tooltip
          heading={t("previewReasoning.tooltips.submissionDate.heading")}
          paragraphOne={t(
            "previewReasoning.tooltips.submissionDate.paragraphOne"
          )}
          placement="bottom-end"
          arrow
        >
          <InfoOutlinedIcon
            style={{
              color: "#ADAEAD",
            }}
            sx={{ ml: 0.7 }}
            fontSize="small"
          />
        </Tooltip>
      </Box>

      <Box
        data-testid="expiry-date"
        bgcolor="rgba(247, 249, 251, 1)"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        py={0.75}
      >
        <Typography sx={{ flexWrap: "nowrap", mr: 1 }} variant="caption">
          {t("previewReasoning.expiryDate")}
        </Typography>
        <Typography
          fontWeight={600}
          sx={{ flexWrap: "nowrap" }}
          variant="caption"
        >
          2nd June 2023 {/** formatDisplayDate(expiryDate) */}
        </Typography>
        <Tooltip
          heading={t("previewReasoning.tooltips.expiryDate.heading")}
          paragraphOne={t("previewReasoning.tooltips.expiryDate.paragraphOne")}
          paragraphTwo={t("previewReasoning.tooltips.expiryDate.paragraphTwo")}
          placement="bottom-end"
          arrow
        >
          <InfoOutlinedIcon
            style={{
              color: "#ADAEAD",
            }}
            sx={{ ml: 0.7 }}
            fontSize="small"
          />
        </Tooltip>
      </Box>

      <Box
        bgcolor="white"
        px={{ xs: 1.4, md: 3 }}
        py={2.5}
        sx={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        <Button
          onClick={onClick}
          variant="contained"
          size="large"
          sx={{
            width: "100%",
            marginBottom: 1.5,
          }}
        >
          {t("previewReasoning.addNewReasoning")}
        </Button>
        <Button
          onClick={onClick}
          variant="contained"
          size="large"
          sx={{
            width: "100%",
          }}
        >
          {t("common.close")}
        </Button>
      </Box>
    </ModalWrapper>
  );
};
