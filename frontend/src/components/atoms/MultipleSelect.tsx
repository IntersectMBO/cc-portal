"use client";
import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { customPalette, ICONS } from "@/constants";
import { MultipleSelectProps } from "../molecules";
import { Checkbox, Icon } from "@mui/material";
import { Input } from "./Input";
import { Typography } from "./Typography";

const ITEM_HEIGHT = 220;
const ITEM_PADDING_TOP = 3;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  item: string,
  selectedValue: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedValue.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function MultipleSelect({
  placeholder,
  items,
  onChange,
}: MultipleSelectProps) {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event;
    const formattedValue = typeof value === "string" ? value.split(",") : value;
    setSelectedValue(formattedValue);
    onChange(formattedValue);
  };

  return (
    <FormControl
      sx={{
        width: "100%",
      }}
    >
      <Select
        multiple
        displayEmpty
        value={selectedValue}
        onChange={handleChange}
        input={<Input />}
        IconComponent={() => <img src={ICONS.arrowDown} />}
        renderValue={() => (
          <Typography
            fontWeight={400}
            variant="body1"
            color={customPalette.inputPlaceholder}
          >
            {placeholder}
          </Typography>
        )}
        MenuProps={MenuProps}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {items.map((item) => (
          <MenuItem
            key={item}
            value={item}
            style={getStyles(item, selectedValue, theme)}
          >
            <Checkbox checked={selectedValue.indexOf(item) > -1} />
            <Typography variant="body2">{item}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
