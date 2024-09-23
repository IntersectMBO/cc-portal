import { PATHS } from "@/constants";
import { decodeUserToken } from "@/lib/api";
import { isAnyAdminRole } from "@utils";
import { redirect } from "next/navigation";
import React from "react";

async function AdminLayout({ params: { locale }, children }) {
  const user = await decodeUserToken();

  if (user && !isAnyAdminRole(user?.role)) {
    redirect(`/${locale}/${PATHS.home}`);
  }
  return <>{children}</>;
}

export default AdminLayout;
