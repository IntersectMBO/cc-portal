import { Tooltip, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { Box, Grid } from "@mui/material";
import { getShortenedGovActionId, truncateText } from "@utils";
import ConditionalWrapper from "../ConditionalWrapper";
import { CopyPill } from "../CopyPill";

export const UserBasicInfo = ({
  name,
  email,
  hotAddress,
  maxWidth = 300
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
      textAlign: { xxs: "center", sm: "left" }
    }}
    px={{ xxs: 1, lg: 3 }}
    display="flex"
    flexDirection="column"
  >
    <Typography
      sx={{
        marginBottom: 0.5,
        minHeight: 24,
        width: { xxs: "auto", md: maxWidth }
      }}
      dataTestId="user-info-username-text"
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
          <Typography
            variant="body2"
            fontWeight={400}
            dataTestId="user-info-email-text"
          >
            {truncateText(email, 20)}
          </Typography>
        </Grid>
      </ConditionalWrapper>
    )}
    {hotAddress && (
      <Box display="flex">
        <CopyPill
          copyValue={hotAddress}
          copyText={getShortenedGovActionId(hotAddress)}
        />
      </Box>
    )}
  </Grid>
);
