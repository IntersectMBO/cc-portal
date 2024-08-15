import React from "react";

import { Footer, Hero, HeroActions, TopNav } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { decodeUserToken } from "@/lib/api";
import { redirect } from "next/navigation";
import { PATHS } from "@consts";
import { ContentWrapper } from "@atoms";

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  if (user) {
    redirect(`/${locale}/${PATHS.constitution}`);
  }
  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Hero>
          <HeroActions role="user" />
        </Hero>
      </ContentWrapper>
      <Footer />
    </>
  );
}
