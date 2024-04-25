"use client";

import { useEffect, useState } from "react";
import { getConstitutionByCid } from "@/lib/api";
import { useModal } from "@/context";
import { CompareConstitutionModalState } from "../types";
import { ModalWrapper, ModalHeader, ModalContents, Button } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { styled } from "@mui/material/styles";

export const CompareConstitutionModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { base, target },
    closeModal,
  } = useModal<CompareConstitutionModalState>();

  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    async function fetchVersions({
      base,
      target,
    }: CompareConstitutionModalState) {
      try {
        const currentVersion = await getConstitutionByCid(base);
        const targetVersion = await getConstitutionByCid(target);
        setOldValue(currentVersion.contents);
        setNewValue(targetVersion.contents);
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    }

    if (base && target) {
      fetchVersions({ base, target });
    }
  }, [base, target]);

  const renderDiff = () => {
    const oldLines = oldValue.split("\n");
    const newLines = newValue.split("\n");
    const maxLength = Math.max(oldLines.length, newLines.length);

    return (
      <DiffContainer>
        <DiffPane>
          {Array.from({ length: maxLength }).map((_, index) => (
            <DiffLine
              key={index}
              changed={oldLines[index] !== newLines[index]}
              bgColor="#ffe6e6"
            >
              <NewTextBox>{newLines[index] || ""}</NewTextBox>
            </DiffLine>
          ))}
        </DiffPane>
        <DiffPane>
          {Array.from({ length: maxLength }).map((_, index) => (
            <DiffLine
              key={index}
              changed={oldLines[index] !== newLines[index]}
              bgColor="#e6ffe6"
            >
              <OldTextBox>{oldLines[index] || ""}</OldTextBox>
            </DiffLine>
          ))}
        </DiffPane>
      </DiffContainer>
    );
  };

  return (
    <ModalWrapper
      dataTestId="compare-constitution-modal"
      icon={IMAGES.pastelSignIn}
      variant="wide"
      scrollable
    >
      <ModalHeader>{t("compareConstitution.headline")}</ModalHeader>
      <ModalContents>
        {oldValue && newValue ? renderDiff() : <p>Loading...</p>}
        <Button variant="outlined" onClick={closeModal}>
          {t("common.close")}
        </Button>
      </ModalContents>
    </ModalWrapper>
  );
};

const DiffContainer = styled("div")`
  display: flex;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
`;

const DiffPane = styled("div")`
  flex: 1;
  padding: 8px;
`;

const DiffLine = styled("div")<{
  changed: boolean;
  bgColor: string;
}>`
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.changed ? props.bgColor : "white")};
  width: 350px;
`;

const OldTextBox = styled("span")`
  flex: 1;
  white-space: pre-wrap;
  padding-left: 8px;
`;

const NewTextBox = styled("span")`
  flex: 1;
  white-space: pre-wrap;
  padding-right: 8px;
`;
