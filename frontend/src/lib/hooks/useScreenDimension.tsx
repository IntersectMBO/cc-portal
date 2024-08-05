"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * A custom hook that tracks the screen dimensions and provides useful properties
 * such as screen width, whether the device is mobile, and page padding based on the screen width.
 */
export const useScreenDimension = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== "undefined") {
      // Set initial screen dimensions
      setScreenWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);

      const handleWindowSizeChange = () => {
        setScreenWidth(window.innerWidth);
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleWindowSizeChange);

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }
  }, []);

  const pagePadding = useMemo(
    () =>
      screenWidth < 768
        ? 2
        : screenWidth < 1024
        ? 6
        : screenWidth < 1440
        ? 8
        : screenWidth < 1920
        ? 10
        : 37,
    [screenWidth]
  );

  return {
    screenWidth,
    isMobile,
    pagePadding,
  };
};
