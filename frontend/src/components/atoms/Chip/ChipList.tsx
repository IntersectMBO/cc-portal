import { Grid } from "@mui/material";
import { Chip } from "./Chip";

export const ChipList = ({
  list,
  hideCloseButton,
}: {
  list: string[];
  hideCloseButton?: boolean;
}) => (
  <Grid container gap={1}>
    {list.map((item, index) => (
      <Grid item key={index}>
        <Chip hideCloseButton={hideCloseButton} label={item} />
      </Grid>
    ))}
  </Grid>
);
