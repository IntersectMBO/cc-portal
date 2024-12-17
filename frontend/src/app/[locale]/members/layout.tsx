import { Footer, TopNav } from "@/components/organisms";
import { decodeUserToken } from "@/lib/api";
import { Box } from "@mui/material";
import { isAnyAdminRole } from "@utils";

export default async function MembersLayout({
  children,
  users,
  admins
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  admins: React.ReactNode;
}) {
  const user = await decodeUserToken();

  return (
    <Box>
      <TopNav />
      {children}
      {user && isAnyAdminRole(user?.role) ? admins : users}
      <Footer />
    </Box>
  );
}
