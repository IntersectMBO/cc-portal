"use client";
import { createContext, useContext, useMemo, useReducer } from "react";

import { callAll, basicReducer, BasicReducer } from "@utils";
import { MuiModalChildren } from "@atoms";
import { SignInModal, AddMemberModal, UploadConstitution } from "@organisms";
import { SignUpModal } from "@/components/organisms/Modals/SignUpModal";
import { SignOutModal } from "@/components/organisms/Modals/SignOutModal";

interface ProviderProps {
  children: React.ReactNode;
}

interface ContextModal {
  component: null | MuiModalChildren;
  variant?: "modal" | "popup";
  preventDismiss?: boolean;
  onClose?: () => void;
}

export type ModalType =
  | "none"
  | "signIn"
  | "signUpModal"
  | "addMember"
  | "signOutModal"
  | "uploadConstitution";

const modals: Record<ModalType, ContextModal> = {
  none: {
    component: null,
  },
  signIn: {
    component: <SignInModal />,
  },
  signUpModal: {
    component: <SignUpModal />,
  },
  signOutModal: {
    component: <SignOutModal />,
  },
  addMember: {
    component: <AddMemberModal />,
  },
  uploadConstitution: {
    component: <UploadConstitution />,
  },
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface ModalState<T> {
  type: ModalType;
  state: T | null;
}

interface ModalContext<T> {
  modal: ModalState<T>;
  modals: Record<ModalType, ContextModal>;
  state: T | null;
  openModal: (modal: Optional<ModalState<T>, "state">) => void;
  closeModal: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalContext = createContext<ModalContext<any>>({} as ModalContext<any>);
ModalContext.displayName = "ModalContext";

function ModalProvider<T>(props: ProviderProps) {
  const [modal, openModal] = useReducer<BasicReducer<ModalState<T>>>(
    basicReducer,
    {
      state: null,
      type: "none",
    }
  );

  const value = useMemo(
    () => ({
      modals,
      modal,
      state: modal.state,
      openModal,
      closeModal: callAll(modals[modal.type]?.onClose, () =>
        openModal({ type: "none", state: null })
      ),
    }),
    [modal, openModal]
  );

  return (
    <ModalContext.Provider value={value} {...props}>
      {props.children}
    </ModalContext.Provider>
  );
}

function useModal<T>() {
  const context = useContext<ModalContext<T>>(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export { ModalProvider, useModal };
