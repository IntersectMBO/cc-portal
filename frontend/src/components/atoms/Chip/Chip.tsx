import { customPalette, ICONS } from "@consts";
import { Grid, IconButton } from "@mui/material";
import { Typography } from "../Typography";

interface ChipProps {
  label: string;
  showCloseButton?: boolean;
  onClick?: () => void;
}
export const Chip = ({
  label,
  showCloseButton = false,
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
    {showCloseButton && (
      <IconButton onClick={onClick} sx={{ padding: 0 }}>
        <img src={ICONS.close} />
      </IconButton>
    )}
  </Grid>
);
