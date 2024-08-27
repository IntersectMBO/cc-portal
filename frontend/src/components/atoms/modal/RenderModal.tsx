"use client";
import { Modal } from "@/components/atoms";
import { useModal } from "@/context";
import { callAll } from "../../../lib/utils/callAll";

export const RenderModal = () => {
  const { modal, openModal, modals } = useModal();

  return (
    modals[modal.type]?.component && (
      <Modal
        open={Boolean(modals[modal.type].component)}
        handleClose={
          !modals[modal.type].preventDismiss
            ? callAll(modals[modal.type]?.onClose, () =>
                openModal({ type: "none", state: null })
              )
            : undefined
        }
      >
        {modals[modal.type]?.component ?? <></>}
      </Modal>
    )
  );
};
