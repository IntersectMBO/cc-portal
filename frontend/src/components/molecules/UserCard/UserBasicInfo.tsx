import { IMAGES } from "@consts";
import { Typography } from "@atoms";
import { Grid } from "@mui/material";

export const UserBasicInfo = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => (
  <Grid
    container
    sx={{
      borderRight: { xxs: "none", md: "1px solid #D6E2FF" },
      paddingRight: 3,
      width: { xxs: "auto", md: 300 },
      height: "100%",
    }}
    px={{ xxs: 1, lg: 3 }}
  >
    <Typography
      sx={{
        marginBottom: 0.5,
        minHeight: 24,
        width: "100%",
      }}
      variant="body1"
    >
      {name}
    </Typography>
    <Grid container gap={1} flexWrap="nowrap">
      <img src={IMAGES.mail} width={20} height={20} />
      <Typography variant="body2" fontWeight={400}>
        {email}
      </Typography>
    </Grid>
  </Grid>
);
