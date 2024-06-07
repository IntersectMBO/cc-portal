import React, { Suspense } from "react";

import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, TopNav } from "@organisms";
import { Loading } from "@molecules";
import { decodeUserToken, getUserVotes } from "@/lib/api";
import { MyActions } from "@/components/organisms/MyActions";

export default async function MyActionsPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  const userActions = await getUserVotes(user.userId);

  return (
    <main>
      <TopNav />
      <Suspense fallback={<Loading />}>
        <MyActions actions={userActions} />;
      </Suspense>
      <Footer />
    </main>
  );
}
