import { customPalette } from "@/constants";
import { Box } from "@mui/material";

export default function ConstitutionLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <Box sx={{ backgroundColor: customPalette.bgWhite }}>{children}</Box>;
}
