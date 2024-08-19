"use client";
import { useEffect, useState } from "react";

/**
 * Custom hook to track document visibility changes.
 * Returns a boolean indicating whether the document is currently visible or not.
 * This hook is utilized in AppContextProvider to log out the user from all active browser tabs.
 */
export function useDocumentVisibility() {
  const [isDocumentVisible, setIsDocumentVisible] = useState(false);

  const handleVisibilityChange = () => {
    setIsDocumentVisible(!document.hidden);
  };

  useEffect(() => {
    // Check if document is defined before using it
    if (typeof document !== "undefined") {
      setIsDocumentVisible(!document.hidden);
    }
  }, []);

  useEffect(() => {
    // Check if document is defined before adding event listener
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, []);

  return isDocumentVisible;
}
