"use client";

import { Button, ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { fetchConstitutionsDiff } from "@/lib/api";
import { useModal } from "@/context";
import { CompareConstitutionModalState } from "../types";

export const CompareConstitutionModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { base, target },
    closeModal,
  } = useModal<CompareConstitutionModalState>();
  const [diff, setDiff] = useState([]);

  useEffect(() => {
    async function fetchDiff({ base, target }: CompareConstitutionModalState) {
      try {
        const diff = await fetchConstitutionsDiff(base, target);
        setDiff(diff);
      } catch (error) {}
    }
    if (base && target) {
      fetchDiff({ base, target });
    }
  }, [base, target]);

  return (
    <ModalWrapper
      dataTestId="compare-constitution-modal"
      icon={IMAGES.pastelSignIn}
    >
      <ModalHeader>{t("compareConstitution.headline")}</ModalHeader>

      <ModalContents>
        {/** TODO display diff here */}
        <Button variant="outlined" onClick={closeModal}>
          {t("common.close")}
        </Button>
      </ModalContents>
    </ModalWrapper>
  );
};
