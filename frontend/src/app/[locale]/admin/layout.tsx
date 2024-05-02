import { decodeUserToken } from "@/lib/api";
import { Box } from "@mui/material";
import { AdminFooter, AdminTopNav, Footer } from "@organisms";
import React from "react";

async function AdminLayout({ children }) {
  const user = await decodeUserToken();

  return (
    <>
      {<AdminTopNav isLoggedIn={!!user} />}
      <Box mb={10}>{children}</Box>
      {user ? <AdminFooter /> : <Footer showSignIn={false} />}
    </>
  );
}

export default AdminLayout;
