"use client";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ICONS, IMAGES } from "@consts";
import { Button } from "../atoms";
import { useAppContext, useModal } from "@context";
import { FetchUserData } from "@/lib/requests";
import { useTranslations } from "next-intl";

export default function AuthButton({ user }: { user: FetchUserData }) {
  const { openModal } = useModal();
  const { logout } = useAppContext();
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
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
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
      >
        <MenuItem onClick={editProfile}>{t("editProfile")}</MenuItem>
        <MenuItem onClick={signOut}>{t("signOut")}</MenuItem>
      </Menu>
    </div>
  );
}
