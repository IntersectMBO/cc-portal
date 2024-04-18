import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { customPalette, ICONS } from "@consts";
import { MultipleSelectProps } from "../molecules";
import { Checkbox } from "@mui/material";
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
  itemValue: string,
  selectedValue: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedValue.indexOf(itemValue) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function MultipleSelect({
  placeholder,
  items,
  onChange,
  multiple = true,
  required,
  name,
}: MultipleSelectProps) {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event;
    const formattedValue = typeof value === "string" ? value.split(",") : value;
    setSelectedValue(formattedValue);
    onChange(event);
  };

  const renderValue = () => {
    if (!multiple) {
      if (selectedValue.length === 0) {
        return (
          <Typography
            fontWeight={400}
            variant="body1"
            color={customPalette.inputPlaceholder}
          >
            {placeholder}
          </Typography>
        );
      }
      const selectedOption = items.find(
        (item) => item.value === selectedValue[0]
      );
      if (selectedOption) {
        return <Typography variant="body2">{selectedOption.label}</Typography>;
      }
    }
    return (
      <Typography
        fontWeight={400}
        variant="body1"
        color={customPalette.inputPlaceholder}
      >
        {placeholder}
      </Typography>
    );
  };

  return (
    <FormControl
      sx={{
        width: "100%",
      }}
    >
      <Select
        name={name}
        multiple={multiple}
        displayEmpty
        value={selectedValue}
        onChange={handleChange}
        input={<Input />}
        IconComponent={() => <img src={ICONS.arrowDown} />}
        renderValue={renderValue}
        MenuProps={MenuProps}
        required={required}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {items.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={getStyles(item.value, selectedValue, theme)}
          >
            {multiple && (
              <Checkbox checked={selectedValue.indexOf(item.value) > -1} />
            )}
            <Typography variant="body2">{item.label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
