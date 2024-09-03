import { customPalette } from "@/constants";
import { DividerProps, Divider as MUIDivider, SxProps } from "@mui/material";

interface Props extends DividerProps {
  sx?: SxProps;
}

export const TableDivider = ({
  sx,
  orientation = "vertical",
  flexItem,
  ...props
}: Props) => (
  <MUIDivider
    color={customPalette.lightBlue}
    orientation={orientation}
    flexItem={flexItem}
    sx={{
      display: { xxs: "none", md: "flex" },
      height: 38,
      alignSelf: "center",
      ...sx
    }}
    {...props}
  />
);
