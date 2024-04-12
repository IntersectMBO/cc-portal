import React from "react";
import { getConstitution } from "@/lib/requests";
import Constitution from "@/components/organisms/Constitution/Constitution";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default async function ConstitutionPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const constitution = await getConstitution();
  return (
    <main>
      <Constitution constitution={constitution} />
    </main>
  );
}
