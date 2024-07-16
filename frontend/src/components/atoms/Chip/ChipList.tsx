import { Grid } from "@mui/material";
import { Chip } from "./Chip";

export const ChipList = ({
  list,
  showCloseButton,
  onClick,
}: {
  list: string[];
  showCloseButton?: boolean;
  onClick?: () => void;
}) => (
  <Grid container gap={1}>
    {list.map((item) => (
      <Grid item key={item}>
        <Chip
          onClick={onClick}
          showCloseButton={showCloseButton}
          label={item}
        />
      </Grid>
    ))}
  </Grid>
);
