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
  dataTestId,
  value = [],
}: MultipleSelectProps) {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = React.useState<string[]>(
    Array.isArray(value) ? value : [value]
  );

  const handleChange = (event: SelectChangeEvent<typeof selectedValue>) => {
    const {
      target: { value },
    } = event;
    const formattedValue = typeof value === "string" ? value.split(",") : value;
    setSelectedValue(formattedValue);
    onChange(event);
  };

  const renderValue = (selected: string[]) => {
    if (!multiple) {
      if (selected.length === 0) {
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
      const selectedOption = items.find((item) => item.value === selected[0]);
      const label = selectedOption?.label ?? "";
      return (
        <Typography dataTestId={`${dataTestId}-item-selected`} variant="body2">
          {label.length > 50 ? `${label.substring(0, 50)}...` : label}
        </Typography>
      );
    }

    if (selected.length === 0) {
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

    const selectedLabels = selected
      .map(
        (selectedItem) =>
          items.find((item) => item.value === selectedItem)?.label
      )
      .filter(Boolean) as string[];

    const combinedText = selectedLabels.join(", ");
    return (
      <Typography dataTestId={`${dataTestId}-selected-values`} variant="body2">
        {combinedText.length > 50
          ? `${combinedText.substring(0, 50)}...`
          : combinedText}
      </Typography>
    );
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Select
        name={name}
        multiple={multiple}
        displayEmpty
        value={selectedValue}
        onChange={handleChange}
        input={<Input />}
        IconComponent={() => <img src={ICONS.arrowDown} />}
        renderValue={(selected) => renderValue(selected as string[])}
        MenuProps={MenuProps}
        required={required}
        data-testid={`${dataTestId}--dropdown`}
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
              <Checkbox
                data-testid={`${dataTestId}--checkbox_${item.value}`}
                checked={selectedValue.indexOf(item.value) > -1}
              />
            )}
            <Typography
              dataTestId={`${dataTestId}-text_${item.value}`}
              variant="body2"
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
