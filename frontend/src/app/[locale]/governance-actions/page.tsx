import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server";
import { Footer, TopNav, GovernanceActions } from "@organisms";
import { Loading } from "@molecules";
import { getGovernanceActions } from "@/lib/api";
import { ContentWrapper } from "@atoms";

export default async function GovernanceActionsPage({
  params: { locale },
  searchParams,
}) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const actions = await getGovernanceActions({
    search: searchParams?.search,
    govActionType: searchParams?.govActionType,
    status: searchParams?.status,
    sortBy: searchParams?.sortBy,
    page: searchParams?.page,
  });

  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Suspense fallback={<Loading />}>
          <GovernanceActions
            paginationMeta={actions?.meta}
            actions={actions?.data}
          />
        </Suspense>
      </ContentWrapper>
      <Footer />
    </>
  );
}
