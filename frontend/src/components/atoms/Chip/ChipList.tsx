import { Grid } from "@mui/material";
import { Chip } from "./Chip";

export const ChipList = ({
  list,
  showCloseButton,
  onClick,
  dataTestId,
}: {
  list: string[];
  showCloseButton?: boolean;
  onClick?: () => void;
  dataTestId?: string;
}) => (
  <Grid container gap={1}>
    {list.map((item) => (
      <Grid item key={item}>
        <Chip
          onClick={onClick}
          showCloseButton={showCloseButton}
          label={item}
          dataTestId={dataTestId}
        />
      </Grid>
    ))}
  </Grid>
);
