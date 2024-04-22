import { IMAGES } from "@consts";
import { Grid } from "@mui/material";

export const UserAvatar = ({
  src,
  width = 40,
  height = 40,
}: {
  src?: string;
  width?: number;
  height?: number;
}) => (
  <Grid
    container
    height="100%"
    alignItems="center"
    justifyContent="center"
    sx={{
      "& img": {
        borderRadius: "50%",
        width: width,
        height: height,
      },
    }}
  >
    <img src={src ? src : IMAGES.avatar} />
  </Grid>
);
