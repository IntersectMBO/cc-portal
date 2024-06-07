import React, { Suspense } from "react";
import { getConstitution } from "@/lib/requests";
import { Constitution, NotFound, Footer, TopNav } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { getConstitutionMetadata } from "@/lib/api";
import { Loading } from "@molecules";
import { ContentWrapper } from "@atoms";

export default async function ConstitutionPage({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.

  const constitution = await getConstitution();
  const metadata = await getConstitutionMetadata();

  return (
    <main>
      <TopNav />
      <ContentWrapper>
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
      </ContentWrapper>
      <Footer />
    </main>
  );
}
