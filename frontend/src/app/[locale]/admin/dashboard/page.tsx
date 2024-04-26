import React, { Suspense, useState } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { UsersList } from "@organisms";
import { decodeUserToken,  getUsers, getUsersAdmin } from "@/lib/api";
import { Loading } from "@/components/molecules";
import { cookieStore } from "@/constants";
import { DecodedToken } from "@/lib/requests";
import { useAppContext } from "@/context";

export default async function AdminDashboard({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  // const { userSession } = useAppContext();
  const users = await getUsersAdmin('dc8734c4-2095-4be3-9bc8-77e063bec817');
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <UsersList usersList={users} />
      </Suspense>
    </main>
  );
}
