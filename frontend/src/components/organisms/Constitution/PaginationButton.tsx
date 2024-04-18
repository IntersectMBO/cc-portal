"use client";
import { IMAGES } from "@/constants";
import { IconButton } from "@mui/material";
import { PaginationButtonProps } from "../types";

export default function PaginationButton({
  handleClick,
  disabled,
  type,
}: PaginationButtonProps) {
  return (
    <IconButton
      data-testid="constitution-pagination-button"
      disabled={disabled}
      onClick={handleClick}
    >
      <img src={IMAGES[type === "prev" ? "arrowLeft" : "arrowRight"]} />
    </IconButton>
  );
}
