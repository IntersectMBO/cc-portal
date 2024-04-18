import React from "react";

import { Footer, Hero, HeroActions, TopNav } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  return (
    <main>
      <TopNav />
      <Hero>
        <HeroActions role="user" />
      </Hero>
      <Footer />
    </main>
  );
}
