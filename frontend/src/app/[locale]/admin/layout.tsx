import { decodeUserToken } from "@/lib/api";
import { AdminFooter, AdminTopNav, Footer } from "@organisms";
import React from "react";

async function AdminLayout({ children }) {
  const user = await decodeUserToken();

  return (
    <>
      {<AdminTopNav isLoggedIn={!!user} />}
      {children}
      {user ? <AdminFooter /> : <Footer />}
    </>
  );
}

export default AdminLayout;
