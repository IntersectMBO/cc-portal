import { PATHS } from "@/constants";
import { decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";
import { AdminFooter, AdminTopNav, Footer } from "@organisms";
import { redirect } from "next/navigation";
import React from "react";

async function AdminLayout({ params: { locale }, children }) {
  const user = await decodeUserToken();

  if (user && !isAnyAdminRole(user?.role)) {
    redirect(`/${locale}/${PATHS.home}`);
  }
  return (
    <>
      {<AdminTopNav isLoggedIn={!!user} />}
      {children}
      {user ? <AdminFooter /> : <Footer showSignIn={false} />}
    </>
  );
}

export default AdminLayout;
