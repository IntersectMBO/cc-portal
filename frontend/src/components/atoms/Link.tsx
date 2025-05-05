import MUILink from "@mui/material/Link";
import NextLink from "next/link";
import { FC } from "react";

import { customPalette, ICONS } from "@/constants";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";

type LinkProps = {
  dataTestId?: string;
  label: string;
  href: string;
  onClick?: () => void;
  size?: "small" | "big";
  external?: boolean;
};

export const Link: FC<LinkProps> = (props) => {
  const { dataTestId, label, href, size = "small", external = false } = props;
  const currentPath = usePathname();
  const isActive = currentPath.includes(href);

  const fontSize = {
    small: 14,
    big: 22,
  }[size];

  return (
    <MUILink
      data-testid={dataTestId}
      href={href}
      underline="none"
      component={NextLink}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize,
          color: "textBlack",
          padding: `16px 16px ${isActive ? "14px" : "16px"} 16px`,
          "&:hover": {
            backgroundColor: customPalette.bgTab,
          },
          borderBottom: isActive
            ? `2px solid ${customPalette.primaryBlue}`
            : "none",
        }}
        variant="body2"
      >
        {label}
        {external && (
          <img
            src={ICONS.externalLink}
            alt="external link"
            style={{ width: 16, height: 16 }}
          />
        )}
      </Typography>
    </MUILink>
  );
};
