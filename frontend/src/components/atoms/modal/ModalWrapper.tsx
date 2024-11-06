"use client";

import { styled, SxProps } from "@mui/material/styles";

import { useModal } from "@/context";
import { useScreenDimension } from "@/lib/hooks";
import { customPalette, ICONS } from "@consts";
import { callAll } from "@utils";

type ModalVariant = "modal" | "popup" | "wide";
interface Props {
  variant?: ModalVariant;
  onClose?: () => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  dataTestId?: string;
  sx?: SxProps;
  icon?: string;
  scrollable?: boolean;
}

export const ModalWrapper = ({
  children,
  variant = "modal",
  dataTestId = "modal",
  sx,
  icon,
  scrollable,
  hideCloseButton = true,
  onClose
}: Props) => {
  const { closeModal } = useModal();
  const { isMobile } = useScreenDimension();
  return (
    <BaseWrapper
      backgroundColor={customPalette.arcticWhite}
      variant={variant}
      data-testid={dataTestId}
      sx={sx}
      scrollable={scrollable}
    >
      {variant !== "popup" && icon && (
        <img
          width={isMobile ? 34 : 64}
          data-testid="modal-icon"
          alt="icon"
          src={icon}
        />
      )}
      {variant !== "popup" && !hideCloseButton && (
        <CloseButton
          data-testid="close-modal-button"
          alt="close"
          onClick={callAll(closeModal, onClose)}
          src={ICONS.close}
        />
      )}

      {children}
    </BaseWrapper>
  );
};

export const BaseWrapper = styled("div")<{
  variant: ModalVariant;
  backgroundColor: string;
  scrollable: boolean;
}>`
  box-shadow: 1px 2px 11px 0px #00123d5e;
  max-height: 90vh;
  min-height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 24px;
  transform: translate(-50%, -50%);
  overflow-y: ${({ scrollable }) => scrollable && "scroll"};
  overflow-x: hidden;
  scrollbar-width: ${({ scrollable }) => (scrollable ? "auto" : "none")};
  @media (max-width: ${700}px) {
    overflow: scroll;
  }

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
    if (variant === "wide") {
      return `
        width: 80vw;
        max-width: fit-content;
        padding: 24px;
      `;
    }
  }}
`;

export const CloseButton = styled("img")`
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 24px;
`;
