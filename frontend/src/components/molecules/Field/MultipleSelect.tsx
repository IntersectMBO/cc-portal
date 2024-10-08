import {
  FormErrorMessage,
  FormHelpfulText,
  MultipleSelect as CustomSelect,
  Typography,
} from "@atoms";
import { Box } from "@mui/material";
import { MultipleSelectProps } from "./types";

export const MultipleSelect = ({
  errorMessage,
  errorStyles,
  helpfulText,
  helpfulTextStyle,
  label,
  labelStyles,
  layoutStyles,
  placeholder,
  items,
  onChange,
  multiple,
  required,
  name,
  dataTestId,
  ...rest
}: MultipleSelectProps) => {
  return (
    <Box sx={{ width: "100%", ...layoutStyles }}>
      {label && (
        <Typography
          fontWeight={400}
          sx={{ mb: 0.5 }}
          variant="body2"
          {...labelStyles}
          dataTestId={`${dataTestId}-text`}
        >
          {label}
        </Typography>
      )}
      <CustomSelect
        onChange={onChange}
        placeholder={placeholder}
        items={items}
        multiple={multiple}
        required={required}
        name={name}
        dataTestId={dataTestId}
      />
      <FormHelpfulText
        helpfulText={helpfulText}
        helpfulTextStyle={helpfulTextStyle}
      />
      <FormErrorMessage errorMessage={errorMessage} errorStyles={errorStyles} />
    </Box>
  );
};
