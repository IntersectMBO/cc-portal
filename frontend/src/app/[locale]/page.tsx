import React from "react";

import {
  Footer,
  Hero,
  HeroActions,
  TopNav,
  FullHeightPageWrapper,
} from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { decodeUserToken } from "@/lib/api";
import { redirect } from "next/navigation";
import { PATHS } from "@consts";

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  if (user) {
    redirect(`/${locale}/${PATHS.constitution}`);
  }
  return (
    <main>
      <FullHeightPageWrapper>
        <TopNav />
        <Hero>
          <HeroActions role="user" />
        </Hero>
        <Footer isFixed />
      </FullHeightPageWrapper>
    </main>
  );
}
