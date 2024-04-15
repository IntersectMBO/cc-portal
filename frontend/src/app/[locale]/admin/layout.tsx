import { AdminFooter, AdminTopNav } from "@organisms";
import React from "react";

async function AdminLayout({ children }) {
  return (
    <>
      <AdminTopNav />
      {children}
      <AdminFooter />
    </>
  );
}

export default AdminLayout;
