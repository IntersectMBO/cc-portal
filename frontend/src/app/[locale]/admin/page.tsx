import React from "react";

import { Hero, HeroActions } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { redirect } from "next/navigation";
import { PATHS } from "@consts";
import { decodeUserToken } from "@/lib/api";

export default async function AdminHome({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  if (user) {
    redirect(`/${locale}/${PATHS.admin.dashboard}`);
  }

  return (
    <main>
      <Hero>
        <HeroActions role="admin" />
      </Hero>
    </main>
  );
}
