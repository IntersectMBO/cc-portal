import { Box } from "@mui/material";

import { Button, Typography } from "@atoms";

import { useTranslations } from "next-intl";
import { ICONS } from "@consts";
import { UserListItem } from "..";
import { UserAvatar } from "../../molecules/UserCard";
import { formatDisplayDate } from "@utils";

export const MembersCard = ({
  id,
  name,
  description,
  profile_photo_url,
  created_at,
}: Pick<
  UserListItem,
  "name" | "id" | "description" | "created_at" | "profile_photo_url"
>) => {
  const t = useTranslations("Members");

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      sx={{
        borderColor: "lightOrange",
        boxShadow: "0px 4px 15px 0px #DDE3F5",
        borderRadius: "20px",
        backgroundColor: "transparent",
        padding: 3,
        paddingBottom: 4,
        maxWidth: "450px",
        height: "386px",
      }}
    >
      <Box>
        <Box textAlign="center" data-testid="members-photo" pb={3}>
          <UserAvatar width={100} height={100} src={profile_photo_url} />
        </Box>
        <Box textAlign="center" data-testid="members-name" pb={3}>
          <Typography variant="headline5">{name} </Typography>

          <Typography fontWeight={400} variant="body1">
            {description}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          size="small"
          data-testid={`members-${id}-joined`}
        >
          {t("card.joined")} {formatDisplayDate(created_at)}
        </Button>
        <Button
          variant="outlined"
          size="small"
          data-testid={`members-${id}-latest-updates`}
          endIcon={<img src={ICONS.arrowUpRight} />}
        >
          {t("card.latestUpdates")}
        </Button>
      </Box>
    </Box>
  );
};
