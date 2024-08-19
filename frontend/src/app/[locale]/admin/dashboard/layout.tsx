import { PATHS } from "@/constants";
import { decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";
import { redirect } from "next/navigation";
import React from "react";
import { AdminFooter, AdminTopNav } from "@organisms";
import { ContentWrapper } from "@/components/atoms";

async function DashboardLayout({ params: { locale }, children }) {
  const user = await decodeUserToken();

  if (user && !isAnyAdminRole(user?.role)) {
    redirect(`/${locale}/${PATHS.home}`);
  }
  return (
    <>
      <AdminTopNav />
      <ContentWrapper>{children}</ContentWrapper>
      <AdminFooter />
    </>
  );
}

export default DashboardLayout;
