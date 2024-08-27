import { IMAGES } from "@/constants";
import { Typography } from "@/components/atoms";
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
    }}
    px={{ xxs: 1, lg: 3 }}
  >
    <Typography sx={{ marginBottom: 0.5 }} variant="body1">
      {name}
    </Typography>
    <Grid container gap={1}>
      <img src={IMAGES.mail} width={20} />
      <Typography variant="body2" fontWeight={400}>
        {email}
      </Typography>
    </Grid>
  </Grid>
);
