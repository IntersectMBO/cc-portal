import { ContentWrapper } from "@/components/atoms";
import { VersionHistory } from "@/components/organisms/Constitution/VersionHistory";
import { getConstitutionMetadata } from "@/lib/api";
import { Loading } from "@molecules";
import { Footer, NotFound, TopNav } from "@organisms";
import { isResponseErrorI } from "@utils";
import { Suspense } from "react";

export default async function VersionHistoryPage() {
  const metadata = await getConstitutionMetadata();

  return (
    <>
      <TopNav />
      <Suspense fallback={<Loading />}>
        {!isResponseErrorI(metadata) && metadata.length > 1 ? (
          <ContentWrapper>
            <VersionHistory metadata={metadata.reverse()} />
          </ContentWrapper>
        ) : (
          <>
            <ContentWrapper>
              <NotFound
                title="versionHistory.title"
                description="versionHistory.description"
              />
            </ContentWrapper>
            <Footer />
          </>
        )}
      </Suspense>
    </>
  );
}
