"use client";
import React from "react";

import { useUsersnapApi } from "../../context/usersnap";
import { Button } from "../atoms";

/**
 * The FeedbackButton component renders a button that, when clicked,
 * forces the Usersnap widget to open, allowing users to provide feedback or report bugs.
 * @param param0 title: Button text
 * @returns
 */
export function FeedbackButton({ title }) {
  const usersnapApi = useUsersnapApi();

  /**
   * This method ignores all the display rules and opens the widget
   * no matter what
   */
  const handleOpenWidgetForce = () => {
    usersnapApi
      ?.show(process.env.NEXT_PUBLIC_USERSNAP_PROJECT_API_KEY)
      .then((widgetApi) => widgetApi.open({}));
  };

  return (
    <Button onClick={handleOpenWidgetForce} variant="outlined">
      {title}
    </Button>
  );
}
