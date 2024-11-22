import ClientRedirect from "@/components/molecules/ClientRedirect";
import { decodeUserToken } from "@/lib/api";
import { ContentWrapper } from "@atoms";
import { PATHS } from "@consts";
import { Footer, Hero, HeroActions, TopNav } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  if (user) {
    return <ClientRedirect href={`/${locale}/${PATHS.constitution}`} />;
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
