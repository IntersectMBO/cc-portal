"use client";
import { customPalette } from "@/constants";
import { SxProps, Tab, Tabs } from "@mui/material";
import { TabI } from "./types";

//Component creates a set of tabs for navigation.
//Each tab represents a different page or section.
export const PageTitleTabs = ({
  tabs,
  onChange,
  selectedValue,
  sx,
}: {
  tabs: TabI[];
  onChange: (newValue: TabI) => void;
  selectedValue: string;
  sx?: SxProps;
}) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onChange(tabs[newValue]);
  };
  const selectedIndex = tabs.findIndex((item) => item.value === selectedValue);

  return (
    <Tabs
      sx={{ mb: { xxs: 1, md: 0 } }}
      value={selectedIndex}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.title}
          sx={{
            textTransform: "none",
            fontSize: { xxs: 16, md: 32 },
            color: customPalette.textBlack,
            ...sx,
          }}
          data-testid={`${tab.value}-tab-button`}
        />
      ))}
    </Tabs>
  );
};
