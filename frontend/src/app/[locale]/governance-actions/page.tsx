import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server";
import { Footer, TopNav, GovernanceActions } from "@organisms";
import { Loading } from "@molecules";
import { decodeUserToken, getUserVotes } from "@/lib/api";
import { ContentWrapper } from "@atoms";

export default async function GovernanceActionsPage({
  params: { locale },
  searchParams,
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  const userActions = await getUserVotes({
    search: searchParams?.search,
    govActionType: searchParams?.govActionType,
    vote: searchParams?.vote,
    sortBy: searchParams?.sortBy,
    userId: user?.userId,
  });

  return (
    <main>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          <GovernanceActions actions={userActions} />
        </Suspense>
      </ContentWrapper>
      <Footer />
    </main>
  );
}
