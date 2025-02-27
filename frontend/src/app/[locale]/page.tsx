import { decodeUserToken } from "@/lib/api";
import { ContentWrapper } from "@atoms";
import { Footer, Hero, HeroActions, TopNav } from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).

export default async function Home({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  return (
    <>
      <TopNav />
      <ContentWrapper>
        <Hero>
          <HeroActions role={user ? user.role : "user"} />
        </Hero>
      </ContentWrapper>
      <Footer />
    </>
  );
}
