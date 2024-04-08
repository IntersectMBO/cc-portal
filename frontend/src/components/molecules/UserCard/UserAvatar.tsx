import { IMAGES } from "@consts";
import { Grid } from "@mui/material";

export const UserAvatar = ({ src }: { src?: string }) => (
  <Grid container height="100%" alignItems="center" justifyContent="center">
    <img src={src ? src : IMAGES.avatar} width={40} height={40} />
  </Grid>
);
