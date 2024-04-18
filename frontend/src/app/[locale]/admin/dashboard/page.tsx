import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { UsersList } from "@organisms";
import { getUsers } from "@/lib/api";
import { Loading } from "@/components/molecules";

export default async function AdminDashboard({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const users = await getUsers();
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <UsersList usersList={users} />
      </Suspense>
    </main>
  );
}
