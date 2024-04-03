"use client";

import { SxProps, styled } from "@mui/material/styles";

import { customPalette } from "@consts";

type ModalVariant = "modal" | "popup";
interface Props {
  variant?: ModalVariant;
  onClose?: () => void;
  children: React.ReactNode;
  dataTestId?: string;
  sx?: SxProps;
  icon?: string;
}

export const ModalWrapper = ({
  children,
  variant = "modal",
  dataTestId = "modal",
  sx,
  icon,
}: Props) => {
  return (
    <BaseWrapper
      backgroundColor={customPalette.arcticWhite}
      variant={variant}
      data-testid={dataTestId}
      sx={sx}
    >
      {variant !== "popup" && (
        <img width={64} data-testid="modal-icon" alt="icon" src={icon} />
      )}

      {children}
    </BaseWrapper>
  );
};

export const BaseWrapper = styled("div")<{
  variant: ModalVariant;
  backgroundColor: string;
}>`
  box-shadow: 1px 2px 11px 0px #00123d5e;
  max-height: 90vh;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 24px;
  transform: translate(-50%, -50%);

  ${({ variant }) => {
    if (variant === "modal") {
      return `
        width: 80vw;
        max-width: 510px;
        padding: 24px;
      `;
    }
    if (variant === "popup") {
      return `
        width: 320px;
        height: 320px;
      `;
    }
  }}
`;
