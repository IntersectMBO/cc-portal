import React from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { UsersList, UsersListProps } from "@/components/organisms";

export default function AdminDashboard({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const mockedUserData: UsersListProps[] = [
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Constitutional member", "Admin"],
      status: "pending",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Constitutional member"],
      status: "pending",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Admin"],
      status: "active",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Constitutional member", "Admin"],
      status: "active",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Alumni member"],
      status: "inactive",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Constitutional member", "Admin"],
      status: "active",
    },
    {
      name: "Nicole",
      email: "nicolejameson@gmail.com",
      roles: ["Constitutional member", "Admin"],
      status: "inactive",
    },
  ];
  return (
    <main>
      <UsersList usersList={mockedUserData} />
    </main>
  );
}
