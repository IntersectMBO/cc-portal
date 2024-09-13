import { Suspense } from "react";

import { decodeUserToken, getUserVotes } from "@/lib/api";
import { ContentWrapper } from "@atoms";
import { Loading } from "@molecules";
import { Footer, MyActions, TopNav } from "@organisms";
import { isResponseErrorI } from "@utils";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default async function MyActionsPage({
  params: { locale },
  searchParams
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  const userActions = await getUserVotes({
    search: searchParams?.search,
    govActionType: searchParams?.govActionType,
    vote: searchParams?.vote,
    sortBy: searchParams?.sortBy,
    userId: user?.userId
  });
  const hasError = isResponseErrorI(userActions);
  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          <MyActions
            actions={!hasError && userActions?.data}
            paginationMeta={!hasError && userActions?.meta}
            error={hasError && userActions.error}
            userId={user?.userId}
          />
          ;
        </Suspense>
      </ContentWrapper>
      <Footer />
    </>
  );
}
