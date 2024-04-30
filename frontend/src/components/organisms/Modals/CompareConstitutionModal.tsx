"use client";

import { useEffect, useState } from "react";
import { getConstitutionByCid } from "@/lib/api";
import { useModal } from "@/context";
import { CompareConstitutionModalState } from "../types";
import { ModalWrapper, ModalHeader, ModalContents, Button } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import DiffViewer from "react-diff-viewer";

export const CompareConstitutionModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { base, target },
    closeModal,
  } = useModal<CompareConstitutionModalState>();

  const [currentVersion, setCurrentVersion] = useState("");
  const [targetVersion, setTargetVersion] = useState("");

  useEffect(() => {
    async function fetchVersions({
      base,
      target,
    }: CompareConstitutionModalState) {
      try {
        const currentVersion = await getConstitutionByCid(base);
        const targetVersion = await getConstitutionByCid(target);
        setCurrentVersion(currentVersion.contents);
        setTargetVersion(targetVersion.contents);
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    }

    if (base && target) {
      fetchVersions({ base, target });
    }
  }, [base, target]);

  return (
    <ModalWrapper
      dataTestId="compare-constitution-modal"
      icon={IMAGES.pastelSignIn}
      variant="wide"
      scrollable
    >
      <ModalHeader>{t("compareConstitution.headline")}</ModalHeader>
      <ModalContents>
        {currentVersion && targetVersion ? (
          <DiffViewer
            oldValue={targetVersion}
            newValue={currentVersion}
            splitView={true}
            disableWordDiff
            styles={{
              diffContainer: {
                fontSize: "14px",
                lineHeight: "1.6",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px",
              },
              line: {
                fontSize: "inherit",
              },
              gutter: {
                background: "#f7f7f7",
                color: "#666",
                padding: "0 8px",
              },
            }}
          />
        ) : (
          <p>Loading...</p>
        )}
        <Button variant="outlined" onClick={closeModal}>
          {t("common.close")}
        </Button>
      </ModalContents>
    </ModalWrapper>
  );
};
