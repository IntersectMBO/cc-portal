import { Suspense } from "react";

import { getMembers } from "@/lib/api";
import { ContentWrapper } from "@atoms";
import { Loading } from "@molecules";
import { MembersCardList, NotFound } from "@organisms";
import { isEmpty, isResponseErrorI } from "@utils";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default async function UserMembers({
  params: { locale },
  searchParams
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const members = await getMembers({
    search: searchParams?.search,
    sortBy: searchParams?.sortBy
  });
  const hasError = isResponseErrorI(members);
  return (
    <>
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
    </>
  );
}
