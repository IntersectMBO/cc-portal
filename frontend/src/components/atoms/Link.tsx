import { FC } from "react";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";

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
  const { dataTestId, label, href, size = "small", onClick } = props;
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
    >
      <Typography
        sx={{
          fontSize,
          fontWeight: isActive && href !== "" ? 600 : 500,
          color: isActive && href !== "" ? "#FF640A" : "textBlack",
        }}
        variant="body2"
      >
        {label}
      </Typography>
    </MUILink>
  );
};
