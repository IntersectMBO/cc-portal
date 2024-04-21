import React from "react";
import { getConstitution } from "@/lib/requests";
import { Constitution } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, TopNav } from "@organisms";

export default async function ConstitutionPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const constitution = await getConstitution();
  return (
    <main>
      <TopNav />
      <Constitution constitution={constitution} />
      <Footer />
    </main>
  );
}
