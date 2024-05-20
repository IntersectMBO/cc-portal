import * as React from "react";
import MUITabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabPanel } from "./TabPanel";
import { Typography } from "@atoms";
import { primaryBlue } from "@consts";

interface TabsI {
  label: string;
  Component: React.ReactNode;
}

export function Tabs({ tabs }: { tabs: TabsI[] }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <MUITabs
          value={value}
          onChange={handleChange}
          aria-label="tabs"
          TabIndicatorProps={{
            style: { display: "none" },
          }}
          sx={{
            "& .MuiTabs-scroller": {
              "& .MuiTabs-flexContainer": {
                "& .MuiTab-root:first-child": {
                  paddingLeft: 0,
                },
              },
            },
          }}
        >
          {tabs.map(({ label }, i) => {
            const isSelected = value === i;
            return (
              <Tab
                label={
                  <Typography
                    variant="body2"
                    color={primaryBlue.c300}
                    sx={{ textTransform: "none" }}
                    fontWeight={isSelected ? 700 : 500}
                  >
                    {label}
                  </Typography>
                }
                key={i}
              />
            );
          })}
        </MUITabs>
      </Box>
      {tabs.map(({ Component }, i) => (
        <TabPanel value={value} index={i} key={i}>
          {Component}
        </TabPanel>
      ))}
    </Box>
  );
}
