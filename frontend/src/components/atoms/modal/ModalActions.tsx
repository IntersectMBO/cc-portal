import { Box, CircularProgress } from "@mui/material";
import { Button } from "@atoms";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { callAll } from "@utils";

interface Props {
  onClose?: () => void;
  isSubmitting?: boolean;
  dataTestId?: string;
}

export const ModalActions = ({
  onClose,
  isSubmitting,
  dataTestId = "modal-action",
}: Props) => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
      }}
    >
      <Button
        type="submit"
        startIcon={
          isSubmitting && <CircularProgress color="inherit" size="14px" />
        }
        data-testid={`${dataTestId}-confirm-button`}
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
