import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, MembersCardList, TopNav } from "@organisms";
import { getMembers } from "@/lib/api";
import { Loading } from "@molecules";

export default async function Members({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const members = await getMembers();

  return (
    <main>
      <TopNav />
      <Suspense fallback={<Loading />}>
        <MembersCardList members={members} />;
      </Suspense>
      <Footer />
    </main>
  );
}
