import { useAppContext, useModal } from "@/context";
import { Button, CopyButton, Typography } from "@atoms";
import { customPalette, ICONS, PATHS } from "@consts";
import { Box, Grid, IconButton } from "@mui/material";
import { getShortenedGovActionId } from "@utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const Anchor = ({ id, offset = "-20vh " }) => {
  return (
    <span
      id={id}
      style={{
        display: "block",
        position: "relative",
        top: offset,
        visibility: "hidden",
      }}
    />
  );
};

export const HeadingAnchor = ({ children, id }) => (
  <>
    {children}
    <Anchor id={id} offset="-30vh" />
  </>
);

export const Heading1 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        lineHeight: "1.25em",
        fontSize: { xxs: 20, md: 32 },
      }}
      variant="headline4"
    >
      {children}
    </Typography>
    <Anchor id={id} offset="-30vh" />
  </>
);

export const Heading2 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        fontWeight: 600,
        fontSize: { xxs: 16, md: 20 },

        lineHeight: "1.25em",
      }}
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const Heading3 = ({ children, id }) => (
  <>
    <Typography
      sx={{
        marginTop: "24px",
        marginBottom: "16px",
        fontWeight: 600,
        fontSize: { xxs: 14, md: 18 },
        lineHeight: "1.25em",
      }}
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);
export const Heading5 = ({ children }) => (
  <Typography
    variant="headline5"
    sx={{
      marginTop: "22px",
      marginBottom: "22px",
      fontWeight: 800,
      fontSize: { xxs: 12, md: 14 },
      lineHeight: "1em",
      overflowWrap: "break-word",
    }}
  >
    {children}
  </Typography>
);

export const Paragraph = ({ children, id }) => (
  <>
    <Typography
      sx={{
        lineHeight: "1.5",
        marginBottom: "16px",
        fontSize: "14px",
        color: customPalette.textGray,
      }}
      variant="caption"
    >
      {children}
    </Typography>
    <Anchor id={id} />
  </>
);

export const ListItem = ({ children, id }) => (
  <li
    style={{
      fontSize: "14px",
      color: customPalette.textGray,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      wordBreak: "break-all",
    }}
  >
    {children}
  </li>
);

export const Code = ({ children }) => (
  <code
    style={{
      lineHeight: "1.5",
      fontSize: "14px",
      padding: ".2em .4em",
      margin: 0,
      whiteSpace: "break-spaces",
      backgroundColor: "#afb8c133",
      borderRadius: "6px",
    }}
  >
    {children}
  </code>
);

export const TABLE_OF_CONTENTS_WRAPPER_STYLE_PROPS = {
  backgroundColor: customPalette.neutralWhite,
  borderRadius: "16px",
  padding: "12px",
  "& ol.toc-level": {
    margin: 0,
  },
  "& ol.toc-level-1": {
    paddingInlineStart: "20px",

    "& li": {
      listStyle: "outside !important",
      "& a.toc-link-h1": {
        fontWeight: 600,
      },
    },
  },
  "& ol.toc-level-2": {
    margin: "10px 0px 10px 0px",
  },
  "& li": {
    width: "100%",
    "& a": {
      width: "100%",
      textDecoration: "none",
      textAlign: "left",
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "56px",
      color: customPalette.textBlack,
    },
  },
};
export const DrawerNav = () => {
  const t = useTranslations("Constitution");

  const pathname = usePathname();
  const linkPath = pathname.includes(PATHS.versionHistory)
    ? PATHS.constitution
    : PATHS.versionHistory;
  const buttonLabel = pathname.includes(PATHS.versionHistory)
    ? t("drawer.backToContents")
    : t("drawer.versionHistory");
  const buttonEndIcon = pathname.includes(PATHS.versionHistory)
    ? ICONS.arrowLeft
    : ICONS.documentSearch;

  return (
    <Grid container direction="column" gap={1} p={2} marginTop="auto">
      <Link href={linkPath}>
        <Button fullWidth variant="outlined">
          <img src={buttonEndIcon} style={{ marginRight: 8 }} />
          {buttonLabel}
        </Button>
      </Link>
    </Grid>
  );
};
export const NavDrawerDesktop = ({
  children,
  left = 0,
  top = { xxs: 75, md: 90 },
  dataTestId,
}: {
  children: ReactNode;
  left: number;
  top: { xxs: number; md: number };
  dataTestId?: string;
}) => {
  return (
    <Grid
      data-testid={dataTestId}
      display={{ xxs: "none", md: "block" }}
      position="fixed"
      left={left}
      top={top}
      item
      ml={5}
      mt={4}
      sx={{
        borderRadius: "16px",
        height: { xxs: "95vh", md: "calc(100vh - 118px)" },
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        ...TABLE_OF_CONTENTS_WRAPPER_STYLE_PROPS,
      }}
    >
      <Box
        sx={{
          height: { xxs: "90vh", md: "calc(100vh - 150px)" },
          overflowY: "scroll",
          borderRadiusTop: "16px 16px 0 0",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        data-testid="nav-drawer-collapse-container"
      >
        {children}
      </Box>
      <DrawerNav />
    </Grid>
  );
};

export const NavCard = ({
  onClick,
  title,
  description,
  hash,
  url,
  isActive,
  isLatest,
}) => {
  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="center"
      data-testid={`${title.replace(" ", "-")}-card`}
      mb={2}
    >
      <Grid
        item
        xxs={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <Typography
            sx={isActive && { color: customPalette.primaryBlue }}
            variant="body1"
          >
            {title}
          </Typography>
          <Typography variant="caption">{description}</Typography>
        </Box>
      </Grid>
      <Grid
        item
        xxs={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          p={0.75}
          border={1}
          borderColor={customPalette.lightBlue}
          borderRadius={100}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="nowrap"
          gap={1}
          width="100%"
        >
          <CopyButton size={14} text={hash} />
          <Typography variant="caption">
            {getShortenedGovActionId(hash)}
          </Typography>
        </Box>
      </Grid>
      {url && (
        <Grid
          item
          xxs={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            target="_blank"
            href={url}
            style={{ cursor: "pointer", display: "flex" }}
          >
            <IconButton>
              <Image
                alt="ipfs link"
                src={ICONS.externalLink}
                width={20}
                height={20}
              />
            </IconButton>
          </Link>
        </Grid>
      )}
      <Grid
        item
        xxs={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isActive && !isLatest && (
          <IconButton data-testid="compare-button" onClick={onClick}>
            <img src={ICONS.eye} width={20} height={20} />
          </IconButton>
        )}
        {isLatest && <Typography variant="caption">{isLatest}</Typography>}
      </Grid>
    </Grid>
  );
};
