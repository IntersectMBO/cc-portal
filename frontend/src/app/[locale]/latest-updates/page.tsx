import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, LatestUpdates, NotFound, TopNav } from "@organisms";
import { Loading } from "@molecules";
import { getLatestUpdates } from "@/lib/api";
import { isEmpty } from "@utils";
import { ContentWrapper } from "@atoms";

export default async function LatestUpdatesPage({
  params: { locale },
  searchParams,
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const latestUpdates = await getLatestUpdates({
    search: searchParams?.search,
    govActionType: searchParams?.govActionType,
    vote: searchParams?.vote,
    sortBy: searchParams?.sortBy,
  });

  return (
    <main>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          {isEmpty(latestUpdates) && isEmpty(searchParams) ? (
            <NotFound
              title="latestUpdates.title"
              description="latestUpdates.description"
            />
          ) : (
            <LatestUpdates latestUpdates={latestUpdates} />
          )}
        </Suspense>
      </ContentWrapper>
      <Footer />
    </main>
  );
}
