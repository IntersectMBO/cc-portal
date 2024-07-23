import { Grid, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

interface Tab {
  path: string;
  title: string;
}

export const PageTitleTabs = ({ tabs }: { tabs: Tab[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isSelectedTab = (path: string) => pathname.includes(path);

  return (
    <Grid container flexWrap="nowrap" gap={3} mb={{ xxs: 1, md: 0 }}>
      {tabs.map((tab) => (
        <Grid item key={tab.path}>
          <Typography
            sx={{ cursor: "pointer" }}
            fontSize={{ xxs: 20, md: 32 }}
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
