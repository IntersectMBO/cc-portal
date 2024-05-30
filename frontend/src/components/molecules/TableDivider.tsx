import { customPalette } from "@/constants";
import { Divider as MUIDivider, DividerProps, SxProps } from "@mui/material";

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
      display: { xs: "none", lg: "flex" },
      height: 38,
      alignSelf: "center",
      ...sx,
    }}
    {...props}
  />
);
