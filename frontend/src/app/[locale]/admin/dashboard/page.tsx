import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { UsersList } from "@organisms";
import { getUsersAdmin } from "@/lib/api";
import { Loading } from "@molecules";
import { isResponseErrorI } from "@utils";

export default async function AdminDashboard({
  params: { locale },
  searchParams,
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const users = await getUsersAdmin({
    search: searchParams?.search,
  });
  const hasError = isResponseErrorI(users);
  return (
    <Suspense fallback={<Loading />}>
      <UsersList
        usersList={!hasError && users?.data}
        paginationMeta={!hasError && users?.meta}
        error={isResponseErrorI(users) && users.error}
      />
    </Suspense>
  );
}
