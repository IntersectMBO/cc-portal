import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, MembersCardList, NotFound, TopNav } from "@organisms";
import { getMembers } from "@/lib/api";
import { Loading } from "@molecules";
import { ContentWrapper } from "@atoms";
import { isEmpty, isResponseErrorI } from "@utils";

export default async function Members({ params: { locale }, searchParams }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const members = await getMembers({
    search: searchParams?.search,
    sortBy: searchParams?.sortBy,
  });
  const hasError = isResponseErrorI(members);
  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          {(isEmpty(members) || hasError) && isEmpty(searchParams) ? (
            <NotFound title="members.title" description="members.description" />
          ) : (
            <MembersCardList
              members={!hasError && members.data}
              paginationMeta={!hasError && members.meta}
              error={hasError && members.error}
            />
          )}
        </Suspense>
      </ContentWrapper>
      <Footer />
    </>
  );
}
