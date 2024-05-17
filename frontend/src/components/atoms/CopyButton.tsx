"use client";

import { useMemo } from "react";

import { ICONS } from "@consts";
import { useTranslations } from "next-intl";
import { useSnackbar } from "@/context/snackbar";

interface Props {
  isChecked?: boolean;
  text: string;
  variant?: string;
  size?: number;
}

export const CopyButton = ({ isChecked, text, variant, size = 24 }: Props) => {
  const { addSuccessAlert } = useSnackbar();
  const t = useTranslations("Snackbar");

  const iconSrc = useMemo(() => {
    if (variant === "blue") {
      return ICONS.copyIcon;
    }

    if (isChecked) {
      return ICONS.copyIcon;
    }

    return ICONS.copyIcon;
  }, [isChecked, variant]);

  return (
    <img
      data-testid="copy-button"
      alt="copy"
      onClick={(e) => {
        navigator.clipboard.writeText(text);
        addSuccessAlert(t("copiedToClipboard"));
        e.stopPropagation();
      }}
      src={iconSrc}
      style={{ cursor: "pointer" }}
      width={size}
      height={size}
    />
  );
};
