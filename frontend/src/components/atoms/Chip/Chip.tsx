import { customPalette, ICONS } from "@/constants";
import { Grid } from "@mui/material";
import { Typography } from "../Typography";

interface ChipProps {
  label: string;
  hideCloseButton?: boolean;
  onClick?: () => void;
}
export const Chip = ({
  label,
  hideCloseButton = false,
  onClick,
}: ChipProps) => (
  <Grid
    container
    gap={0.5}
    px={2.25}
    py={0.75}
    bgcolor={customPalette.lightBlue}
    borderRadius={100}
  >
    <Typography data-testid={`TODO-type`} variant="caption">
      {label}
    </Typography>
    {!hideCloseButton && <img src={ICONS.close} onClick={onClick} />}
  </Grid>
);
