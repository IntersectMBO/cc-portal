import { Box } from "@mui/material";
import { Button } from "@atoms";
import { useTranslations } from "next-intl";
import { useModal } from "@/context";
import { callAll } from "@utils";

interface Props {
  onClose?: () => void;
  onConfirm: () => void;
}

export const ModalActions = ({ onClose, onConfirm }: Props) => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();

  return (
    <Box
      sx={{
        display: "flex",
        gap: "38px",
      }}
    >
      <Button onClick={onConfirm}>{t("common.confirm")}</Button>
      <Button variant="outlined" onClick={callAll(closeModal, onClose)}>
        {t("common.close")}
      </Button>
    </Box>
  );
};
