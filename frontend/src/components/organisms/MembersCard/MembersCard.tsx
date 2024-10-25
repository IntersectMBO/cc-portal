import { Box } from "@mui/material";

import { Button, Typography } from "@atoms";

import { formatDisplayDate, truncateText } from "@utils";
import { useTranslations } from "next-intl";
import { UserListItem } from "..";
import { UserAvatar } from "../../molecules/UserCard";

export const MembersCard = ({
  id,
  name,
  description,
  profile_photo_url,
  created_at
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
        height: "386px"
      }}
    >
      <Box>
        <Box textAlign="center" data-testid="members-photo" pb={3}>
          <UserAvatar width={100} height={100} src={profile_photo_url} />
        </Box>
        <Box textAlign="center" data-testid="members-name" pb={3}>
          <Typography variant="headline5">{name} </Typography>

          <Typography fontWeight={400} variant="body1">
            {truncateText(description, 150)}
          </Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xxs: "column", md: "row" }}
        justifyContent="center"
        gap={{ xxs: 1, md: 0 }}
      >
        <Button
          sx={{ pointerEvents: "none" }}
          variant="text"
          size="small"
          data-testid={`members-${id}-joined`}
        >
          {t("card.joined")} {formatDisplayDate(created_at)}
        </Button>

        {/** 
         * temporarily hidden
         * TODO: uncomment and handle button click
         * <Button
          variant="outlined"
          size="small"
          data-testid={`members-${id}-latest-updates`}
          endIcon={<img src={ICONS.arrowUpRight} />}
        >
          {t("card.latestUpdates")}
        </Button>
        */}
      </Box>
    </Box>
  );
};
