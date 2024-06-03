import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, LatestUpdates, TopNav } from "@organisms";
import { Loading } from "@molecules";
import { getLatestUpdates } from "@/lib/api";

export default async function LatestUpdatesPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const latestUpdates = await getLatestUpdates();

  return (
    <main>
      <TopNav />
      <Suspense fallback={<Loading />}>
        <LatestUpdates latestUpdates={latestUpdates} />;
      </Suspense>
      <Footer />
    </main>
  );
}
