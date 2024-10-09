import { customPalette, ICONS } from "@consts";
import { Grid, IconButton } from "@mui/material";
import { Typography } from "../Typography";

interface ChipProps {
  label: string;
  showCloseButton?: boolean;
  onClick?: () => void;
  dataTestId?: string;
}
export const Chip = ({
  label,
  showCloseButton = false,
  onClick,
  dataTestId
}: ChipProps) => (
  <Grid
    container
    gap={0.5}
    px={2.25}
    py={0.75}
    bgcolor={customPalette.lightBlue}
    borderRadius={100}
    alignItems="center"
  >
    <Typography data-testid={`${dataTestId}-text`} variant="caption">
      {label}
    </Typography>
    {showCloseButton && (
      <IconButton
        onClick={onClick}
        sx={{ padding: 0 }}
        data-testid={`${dataTestId}--button`}
      >
        <img width={16} src={ICONS.close} />
      </IconButton>
    )}
  </Grid>
);
