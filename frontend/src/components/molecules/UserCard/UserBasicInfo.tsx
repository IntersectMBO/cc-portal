import { IMAGES } from "@consts";
import { Typography } from "@atoms";
import { Grid } from "@mui/material";
import { getShortenedGovActionId } from "@utils";
import { CopyPill } from "../CopyPill";

export const UserBasicInfo = ({
  name,
  email,
  hotAddress,
  maxWidth = 300,
}: {
  name: string;
  email?: string;
  hotAddress?: string;
  maxWidth?: number;
}) => (
  <Grid
    container
    sx={{
      paddingRight: 3,
      width: { xxs: "auto", md: maxWidth },
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
      dataTestId="user-info-username-text"
      variant="body1"
    >
      {name}
    </Typography>
    {email && (
      <Grid container gap={1} flexWrap="nowrap">
        <img src={IMAGES.mail} width={20} height={20} />
        <Typography
          dataTestId="user-info-email-text"
          variant="body2"
          fontWeight={400}
        >
          {email}
        </Typography>
      </Grid>
    )}
    {hotAddress && (
      <CopyPill
        copyValue={hotAddress}
        copyText={getShortenedGovActionId(hotAddress)}
      />
    )}
  </Grid>
);
