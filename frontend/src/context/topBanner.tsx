"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import {
  getItemFromSessionStorage,
  setItemToSessionStorage,
  TOP_BANER,
} from "@utils";
import { useTranslations } from "next-intl";

interface TopBannerContextI {}

const defaultPosition = {
  vertical: "top",
  horizontal: "center",
} as SnackbarOrigin;

/**
 * The TopBannerContext is designed to manage the display of a top banner notification across the application.
 * This banner is typically used to show important messages to the user, such as site status updates or alerts (e.g., "Site is on beta version").
 * The context provides a mechanism to display the banner only once per session by leveraging session storage.
 */
const TopBannerContext = createContext<TopBannerContextI>(
  {} as TopBannerContextI
);
TopBannerContext.displayName = "TopBannerContext";

export function TopBannerContextProvider({ children }) {
  const [displayPopUp, setDisplayPopUp] = useState(true);
  const t = useTranslations("TopBanner");

  useEffect(() => {
    let returningUser = getItemFromSessionStorage(TOP_BANER);
    setDisplayPopUp(!returningUser);
  }, [displayPopUp]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setItemToSessionStorage(TOP_BANER, true);
    setDisplayPopUp(false);
  };

  return (
    <TopBannerContext.Provider value={{}}>
      {children}
      <Snackbar
        key="top-banner-popup"
        open={displayPopUp}
        onClose={handleClose}
        anchorOrigin={defaultPosition}
      >
        <Alert
          data-testid={`alert-topBannerPopup`}
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{
            minWidth: { xxs: "100vw" },
            backgroundColor: "#FF3333",
          }}
        >
          {t("message")}
        </Alert>
      </Snackbar>
    </TopBannerContext.Provider>
  );
}

export function useTopBannerContext() {
  const context = useContext(TopBannerContext);
  if (context === undefined) {
    throw new Error(
      "useTopBannerContext must be used within a TopBannerContextProvider"
    );
  }

  return context;
}
