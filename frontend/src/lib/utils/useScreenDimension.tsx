"use client";
import { useEffect, useMemo, useState } from "react";

/**
 * A custom hook that tracks the screen dimensions and provides useful properties
 * such as screen width, whether the device is mobile, and page padding based on the screen width.
 */
export const useScreenDimension = () => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
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

  function handleWindowSizeChange() {
    setScreenWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return {
    screenWidth,
    isMobile,
    pagePadding,
  };
};
