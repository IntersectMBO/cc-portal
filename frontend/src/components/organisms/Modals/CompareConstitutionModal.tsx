"use client";

import { useEffect, useState } from "react";
import { getConstitutionByCid } from "@/lib/api";
import { useModal } from "@/context";
import { CompareConstitutionModalState, ConstitutionMetadata } from "../types";
import {
  ModalWrapper,
  ModalHeader,
  ModalContents,
  Button,
  Typography,
} from "@atoms";
import { customPalette, IMAGES, poppins } from "@consts";
import { useTranslations } from "next-intl";
import ReactDiffViewer from "react-diff-viewer-continued";
import { Card, Loading } from "@molecules";
import { Box } from "@mui/material";
import { isResponseErrorI } from "@utils";
import { useSnackbar } from "@/context/snackbar";

export const CompareConstitutionModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { base, target },
    closeModal,
  } = useModal<CompareConstitutionModalState>();
  const { addErrorAlert } = useSnackbar();
  const [currentVersion, setCurrentVersion] = useState("");
  const [targetVersion, setTargetVersion] = useState("");

  useEffect(() => {
    async function fetchVersions({
      base,
      target,
    }: Pick<CompareConstitutionModalState, "base" | "target">) {
      const currentVersion = await getConstitutionByCid(base.cid);
      const targetVersion = await getConstitutionByCid(target.cid);
      if (isResponseErrorI(currentVersion) || isResponseErrorI(targetVersion)) {
        closeModal();
        addErrorAlert(t("compareConstitution.alerts.error"));
      } else {
        setCurrentVersion(currentVersion.contents);
        setTargetVersion(targetVersion.contents);
      }
    }

    if (base && target) {
      fetchVersions({ base, target });
    }
  }, [base, target]);

  const TitleBlock = ({ title, created_date }: ConstitutionMetadata) => (
    <Box mb={3}>
      <Typography sx={{ marginBottom: 0.5 }} variant="body1">
        {title}
      </Typography>
      <Typography variant="caption">{created_date}</Typography>
    </Box>
  );

  return (
    <ModalWrapper
      dataTestId="compare-constitution-modal"
      icon={IMAGES.pastelSignIn}
      variant="wide"
      scrollable
      sx={{
        maxWidth: { xxs: "90%", lg: 1072 },
        width: { xxs: "90% ", lg: 1072 },
      }}
    >
      <ModalHeader>{t("compareConstitution.headline")}</ModalHeader>
      <ModalContents>
        {currentVersion && targetVersion ? (
          <Card
            sx={{
              padding: { xxs: "32px 0", md: "32px 24px" },
              width: { xxs: "fit-content", md: "auto" },
            }}
          >
            <ReactDiffViewer
              oldValue={targetVersion}
              newValue={currentVersion}
              hideLineNumbers={true}
              splitView={true}
              disableWordDiff
              leftTitle={<TitleBlock {...target} />}
              rightTitle={<TitleBlock {...base} />}
              styles={{
                variables: {
                  light: {
                    diffViewerBackground: "white",
                    diffViewerTitleBackground: "white",
                    codeFoldBackground: "white",
                    emptyLineBackground: "white",
                    diffViewerColor: customPalette.textBlack,
                  },
                },
                diffContainer: {
                  fontSize: "16px",
                  lineHeight: "1.6",
                  borderRadius: "4px",
                },
                contentText: {
                  fontFamily: poppins.style.fontFamily,
                },
              }}
            />
          </Card>
        ) : (
          <Loading />
        )}
        <Button variant="outlined" onClick={closeModal}>
          {t("common.close")}
        </Button>
      </ModalContents>
    </ModalWrapper>
  );
};
