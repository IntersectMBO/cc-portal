import React from "react";

import {
  AdminTopNav,
  Footer,
  FullHeightPageWrapper,
  Hero,
  HeroActions,
} from "@organisms";
import { unstable_setRequestLocale } from "next-intl/server"; // Import function to set the request-specific locale (unstable API).
import { redirect } from "next/navigation";
import { PATHS } from "@consts";
import { decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";

export default async function AdminHome({ params: { locale } }) {
  unstable_setRequestLocale(locale); // Sets the locale for the request. Use cautiously due to its unstable nature.
  const user = await decodeUserToken();

  if (user && isAnyAdminRole(user?.role)) {
    redirect(`/${locale}/${PATHS.admin.dashboard}`);
  }

  return (
    <FullHeightPageWrapper>
      <AdminTopNav />
      <Hero>
        <HeroActions role="admin" />
      </Hero>
      <Footer isFixed showSignIn={false} />
    </FullHeightPageWrapper>
  );
}
