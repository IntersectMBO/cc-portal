import { IMAGES } from "@consts";
import { Typography, Tooltip } from "@atoms";
import { Grid } from "@mui/material";
import { getShortenedGovActionId, truncateText } from "@utils";
import { CopyPill } from "../CopyPill";
import ConditionalWrapper from "../ConditionalWrapper";

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
      variant="body1"
    >
      {name}
    </Typography>
    {email && (
      <ConditionalWrapper
        condition={email.length > 20}
        wrapper={(children) => (
          <Tooltip paragraphOne={email}>{children}</Tooltip>
        )}
      >
        <Grid container gap={1} flexWrap="nowrap">
          <img src={IMAGES.mail} width={20} height={20} />
          <Typography variant="body2" fontWeight={400}>
            {truncateText(email, 20)}
          </Typography>
        </Grid>
      </ConditionalWrapper>
    )}
    {hotAddress && (
      <CopyPill
        copyValue={hotAddress}
        copyText={getShortenedGovActionId(hotAddress)}
      />
    )}
  </Grid>
);
