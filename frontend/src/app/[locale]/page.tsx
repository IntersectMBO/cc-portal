import React from "react";

import { Hero, HeroActions } from "@/components/organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  return (
    <main>
      <Hero>
        <HeroActions role="user" />
      </Hero>
    </main>
  );
}
