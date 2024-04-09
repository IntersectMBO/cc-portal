import { Grid } from "@mui/material";
import { Chip } from "./Chip";

export const ChipList = ({ list }: { list: string[] }) => (
  <Grid container gap={1}>
    {list.map((item, index) => (
      <Grid item key={index}>
        <Chip label={item} />
      </Grid>
    ))}
  </Grid>
);