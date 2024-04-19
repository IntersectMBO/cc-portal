"use client";
import * as React from "react";
import Menu from "@mui/material/Menu";
import { ICONS, IMAGES } from "@consts";
import { Button } from "../atoms";
import { useModal } from "@context";
import { FetchUserData } from "@/lib/requests";
import { useTranslations } from "next-intl";
import { Grid } from "@mui/material";

export default function UserProfileButton({
  user,
}: {
  user: Pick<FetchUserData, "name" | "profile_photo">;
}) {
  const { openModal } = useModal();
  const t = useTranslations("Navigation");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const editProfile = () => {
    openModal({
      type: "signUpModal",
    });
    handleClose();
  };

  const signOut = async () => {
    openModal({
      type: "signOutModal",
    });
  };

  return (
    <div>
      <Button
        id="basic-button"
        size="extraLarge"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ minWidth: 170 }}
        startIcon={
          <img
            width={20}
            height={20}
            src={user?.profile_photo || IMAGES.avatar}
          />
        }
        endIcon={<img width={20} height={20} src={ICONS.chevronDown} />}
      >
        {user?.name || "User"}
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
          style: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <Grid
          container
          direction="column"
          sx={{ minWidth: 170, width: "100%" }}
          gap={0.5}
        >
          <Button
            size="medium"
            variant="outlined"
            onClick={editProfile}
            startIcon={<img width={20} height={20} src={ICONS.edit} />}
          >
            {t("editProfile")}
          </Button>
          <Button
            size="medium"
            variant="outlined"
            onClick={signOut}
            startIcon={<img width={20} height={20} src={ICONS.logout} />}
          >
            {t("signOut")}
          </Button>
        </Grid>
      </Menu>
    </div>
  );
}