"use client";
import { FetchUserData } from "@/lib/requests";
import { ICONS, IMAGES, PATHS } from "@consts";
import { useModal } from "@context";
import { UserAvatar } from "@molecules";
import { Box, Grid, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "../atoms";
import theme from "@/theme";

export default function UserProfileButton({
  user,
}: {
  user: Pick<FetchUserData, "name" | "profile_photo_url">;
}) {
  const { openModal } = useModal();
  const t = useTranslations();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | null>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuWidth(event.currentTarget.offsetWidth);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const editProfile = () => {
    openModal({
      type: "signUpModal",
      state: {
        showCloseButton: true,
        title: t("Modals.editProfile.headline"),
      },
    });
    handleClose();
  };

  const signOut = async () => {
    openModal({
      type: "signOutModal",
      state: {
        homeRedirectionPath: PATHS.home,
      },
    });
  };

  const USERNAME_MAX_LENGTH = 32;
  return (
    <>
      <Box sx={{ display: { xxs: "none", md: "block" } }}>
        <Button
          id="basic-button"
          size="extraLarge"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ minWidth: 160 }}
          startIcon={
            <UserAvatar
              src={
                (user?.profile_photo_url &&
                  `${user?.profile_photo_url}?timestamp=${Date.now()}`) ||
                IMAGES.avatar
              }
              width={20}
              height={20}
            />
          }
          endIcon={<img width={20} height={20} src={ICONS.chevronDown} />}
          dataTestId="user-profile-menu-button"
        >
          <Tooltip
            title={user?.name?.length > USERNAME_MAX_LENGTH ? user.name : ""}
            placement="top"
            disableFocusListener
            disableTouchListener
          >
            <span>
              {user?.name?.length > USERNAME_MAX_LENGTH
                ? `${user.name.slice(0, USERNAME_MAX_LENGTH)}...`
                : user?.name || "User"}
            </span>
          </Tooltip>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          PaperProps={{
            style: {
              boxShadow: "1px 2px 11px 0px #00123D5E",
              minWidth: menuWidth || "auto",
              marginTop: "7px",
            },
          }}
        >
          <Grid
            container
            direction="column"
            sx={{ minWidth: 160, width: "100%" }}
            gap={0.5}
          >
            <Button
              size="medium"
              variant="text"
              onClick={editProfile}
              startIcon={<img width={20} height={20} src={ICONS.edit} />}
              data-testid="edit-profile-button"
            >
              {t("Navigation.editProfile")}
            </Button>
            <Button
              size="medium"
              variant="text"
              onClick={signOut}
              startIcon={<img width={20} height={20} src={ICONS.logout} />}
              data-testid="sign-out-button"
            >
              {t("Navigation.signOut")}
            </Button>
          </Grid>
        </Menu>
      </Box>
      <Box sx={{ display: { xxs: "block", md: "none" } }}>
        <Grid container gap={2}>
          <Grid item>
            <UserAvatar
              src={user?.profile_photo_url || IMAGES.avatar}
              width={20}
              height={20}
            />
          </Grid>
          {user?.name || "User"}
        </Grid>
        <Grid
          container
          direction="column"
          sx={{ minWidth: 160, width: "100%" }}
          gap={0.5}
        >
          <Button
            size="medium"
            variant="outlined"
            onClick={editProfile}
            startIcon={<img width={20} height={20} src={ICONS.edit} />}
          >
            {t("Navigation.editProfile")}
          </Button>
          <Button
            size="medium"
            variant="outlined"
            onClick={signOut}
            startIcon={<img width={20} height={20} src={ICONS.logout} />}
          >
            {t("Navigation.signOut")}
          </Button>
        </Grid>
      </Box>
    </>
  );
}
