import { Button } from "@atoms";
import { useModal } from "@context";
import { Box, CircularProgress } from "@mui/material";
import { callAll } from "@utils";
import { useTranslations } from "next-intl";

interface Props {
  onClose?: () => void;
  isSubmitting?: boolean;
  dataTestId?: string;
}

export const ModalActions = ({
  onClose,
  isSubmitting,
  dataTestId = "modal-action"
}: Props) => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2
      }}
    >
      <Button
        type="submit"
        startIcon={
          isSubmitting && <CircularProgress color="inherit" size="14px" />
        }
        data-testid={`${dataTestId}-confirm-button`}
        disabled={isSubmitting}
      >
        {t("common.confirm")}
      </Button>
      <Button
        variant="outlined"
        onClick={callAll(closeModal, onClose)}
        data-testid={`${dataTestId}-close-button`}
      >
        {t("common.close")}
      </Button>
    </Box>
  );
};
