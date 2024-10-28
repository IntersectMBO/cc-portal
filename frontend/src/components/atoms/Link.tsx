import MUILink from "@mui/material/Link";
import NextLink from "next/link";
import { FC } from "react";

import { customPalette } from "@/constants";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";

type LinkProps = {
  dataTestId?: string;
  label: string;
  href: string;
  onClick?: () => void;
  size?: "small" | "big";
};

export const Link: FC<LinkProps> = (props) => {
  const { dataTestId, label, href, size = "small" } = props;
  const currentPath = usePathname();
  const isActive = currentPath.includes(href);

  const fontSize = {
    small: 14,
    big: 22
  }[size];

  return (
    <MUILink
      data-testid={dataTestId}
      href={href}
      underline="none"
      component={NextLink}
    >
      <Typography
        sx={{
          fontSize,
          color: "textBlack",
          padding: `16px 16px ${isActive ? "14px" : "16px"} 16px`,
          "&:hover": {
            backgroundColor: customPalette.bgTab
          },
          borderBottom: isActive
            ? `2px solid ${customPalette.primaryBlue}`
            : "none"
        }}
        variant="body2"
      >
        {label}
      </Typography>
    </MUILink>
  );
};
