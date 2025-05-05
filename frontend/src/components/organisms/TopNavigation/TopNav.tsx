"use client";
import { useEffect, useState } from "react";

import { Box, ButtonBase, Grid, IconButton } from "@mui/material";

import UserProfileButton from "@/components/molecules/UserProfileButton";
import { Link } from "@atoms";
import {
  customPalette,
  IMAGES,
  NAV_ITEMS,
  PATHS,
  PROTECTED_NAV_ITEMS,
} from "@consts";
import { useAppContext, useModal } from "@context";
import { isAnyAdminRole, isUserRole } from "@utils";
import { useTranslations } from "next-intl";
import { DrawerMobile } from "./DrawerMobile";
import { TopNavWrapper } from "./TopNavWrapper";
import { SignupModalState } from "../types";

export const TopNav = () => {
  const { userSession, user } = useAppContext();

  const t = useTranslations();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const { openModal } = useModal<SignupModalState>();

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const getNavItems = (items = NAV_ITEMS) =>
    items.map((navItem) => (
      <Grid item key={navItem.label}>
        <ButtonBase
          focusRipple
          sx={{
            // Change ripple color
            ".MuiTouchRipple-rippleVisible": {
              color: `${customPalette.ripple}`,
            },
          }}
        >
          <Link
            dataTestId={`top-nav-${navItem.href.replace("/", "")}-link`}
            label={navItem.label}
            href={navItem.href}
            external={navItem.newTabLink}
          />
        </ButtonBase>
      </Grid>
    ));

  const renderAuthNavItems = () => {
    return (
      <>
        {getNavItems()}
        {getNavItems(PROTECTED_NAV_ITEMS)}
        {/* {isAnyAdminRole(userSession.role) && (
          <Box ml={{ md: 3 }}>
            <Button
              endIcon={<img src={ICONS.arrowUpRight} />}
              variant="outlined"
              href={PATHS.admin.dashboard}
              component={NextLink}
              data-testid="top-nav-admin-dashboard-button"
              sx={{ width: "100%;" }}
            >
              {t("Navigation.adminDashboard")}
            </Button>
          </Box>
        )} */}
      </>
    );
  };

  const renderUserProfileDropdown = () => {
    return (
      <>
        {(isUserRole(userSession.role) || isAnyAdminRole(userSession.role)) && (
          <Box ml={{ md: 3 }}>
            <UserProfileButton user={user} />
          </Box>
        )}
      </>
    );
  };
  useEffect(() => {
    if (user && !user?.name && isUserRole(userSession.role)) {
      openModal({
        type: "signUpModal",
        state: {
          showCloseButton: false,
          title: t("Modals.signUp.headline"),
          description: t("Modals.signUp.description"),
        },
      });
    }
  }, [user]);

  return (
    <TopNavWrapper homeRedirectionPath={PATHS.home}>
      <Box sx={{ display: { xxs: "none", md: "block" } }}>
        <Box>
          <Grid container item alignItems="center" flexWrap="nowrap">
            {userSession ? (
              <>
                {renderAuthNavItems()}
                {renderUserProfileDropdown()}
              </>
            ) : (
              getNavItems()
            )}
          </Grid>
        </Box>
      </Box>
      <Box sx={{ display: { xxs: "block", md: "none" } }}>
        <IconButton data-testid="open-drawer-button" onClick={openDrawer}>
          <img src={IMAGES.menu} />
        </IconButton>
      </Box>

      <DrawerMobile
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        {userSession ? (
          <>
            {renderAuthNavItems()}
            {renderUserProfileDropdown()}
          </>
        ) : (
          getNavItems()
        )}
      </DrawerMobile>
    </TopNavWrapper>
  );
};
