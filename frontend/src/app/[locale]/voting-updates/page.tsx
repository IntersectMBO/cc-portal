import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, VotingUpdates, NotFound, TopNav } from "@organisms";
import { Loading } from "@molecules";
import { getVotingUpdates } from "@/lib/api";
import { isEmpty, isResponseErrorI } from "@utils";
import { ContentWrapper } from "@atoms";

export default async function VotingUpdatesPage({
  params: { locale },
  searchParams,
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const votingUpdates = await getVotingUpdates({
    search: searchParams?.search,
    govActionType: searchParams?.govActionType,
    vote: searchParams?.vote,
    sortBy: searchParams?.sortBy,
    voteMetadataUrl: searchParams?.voteMetadataUrl,
  });
  const hasError = isResponseErrorI(votingUpdates);
  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          {(isEmpty(votingUpdates) || hasError) && isEmpty(searchParams) ? (
            <NotFound
              title="votingUpdates.title"
              description="votingUpdates.description"
            />
          ) : (
            <VotingUpdates
              votingUpdates={!hasError && votingUpdates?.data}
              paginationMeta={!hasError && votingUpdates?.meta}
              error={hasError && votingUpdates.error}
            />
          )}
        </Suspense>
      </ContentWrapper>
      <Footer />
    </>
  );
}
