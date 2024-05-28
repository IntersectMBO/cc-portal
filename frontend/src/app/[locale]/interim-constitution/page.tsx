import React, { Suspense } from "react";
import { getConstitution } from "@/lib/requests";
import { Constitution, NotFound } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { Footer, TopNav } from "@organisms";
import { getConstitutionMetadata } from "@/lib/api";
import { Loading } from "@/components/molecules";

export default async function ConstitutionPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const constitution = await getConstitution();
  const metadata = await getConstitutionMetadata();

  return (
    <main>
      <TopNav />
      <Suspense fallback={<Loading />}>
        {constitution ? (
          <Constitution
            constitution={constitution}
            metadata={metadata.reverse()}
          />
        ) : (
          <NotFound
            title="constitution.title"
            description="constitution.description"
          />
        )}
      </Suspense>
      <Footer />
    </main>
  );
}
