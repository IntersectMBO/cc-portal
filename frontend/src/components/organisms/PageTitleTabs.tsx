import { Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

interface Tab {
  path: string;
  title: string;
}

export const PageTitleTabs = ({ tabs }: { tabs: Tab[] }) => {
  const router = useRouter();
  const t = useTranslations("MyActions");
  const pathname = usePathname();
  const isSelectedTab = (path: string) => pathname.includes(path);

  return (
    <Grid container flexWrap="nowrap" gap={3}>
      {tabs.map((tab) => (
        <Grid item key={tab.path}>
          <Typography
            sx={{ cursor: "pointer" }}
            fontSize={32}
            fontWeight={isSelectedTab(tab.path) ? 600 : 400}
            component="span"
            onClick={() => router.push(tab.path)}
          >
            {tab.title}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
