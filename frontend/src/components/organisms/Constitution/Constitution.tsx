"use client";

import { Card } from "@molecules";
import { Box, Grid, IconButton } from "@mui/material";
import { MDXRemote } from "next-mdx-remote";
import { useEffect, useState } from "react";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListItem,
  NavDrawerDesktop,
  Paragraph,
  TABLE_OF_CONTENTS_WRAPPER_STYLE_PROPS,
} from "./MDXComponents";
import { ConstitutionProps } from "../types";
import { useTranslations } from "next-intl";
import { Footer } from "../Footer";
import { customPalette, IMAGES } from "@consts";
import { ContentWrapper, Typography } from "@/components/atoms";
import { useScreenDimension } from "@hooks";
import { DrawerMobile } from "../TopNavigation";
import { ConstitutionSidebar } from "./ConstitutionSidebar";
import TOCLink from "./TOCLink";

export function Constitution({ constitution, metadata }: ConstitutionProps) {
  const { isMobile } = useScreenDimension();
  const [isOpen, setIsOpen] = useState(true);

  const t = useTranslations("Constitution");

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const onTOCLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const MDXComponents = {
    nav: ({ children }) =>
      isMobile ? (
        <DrawerMobile
          isDrawerOpen={isOpen}
          setIsDrawerOpen={setIsOpen}
          sx={TABLE_OF_CONTENTS_WRAPPER_STYLE_PROPS}
          rowGap={0}
        >
          <ConstitutionSidebar tableOfContents={children} metadata={metadata} />
        </DrawerMobile>
      ) : (
        <NavDrawerDesktop
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          top={{ xxs: 0, md: 90 }}
          left={0}
        >
          <ConstitutionSidebar tableOfContents={children} metadata={metadata} />
        </NavDrawerDesktop>
      ),
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    li: ListItem,
    code: Code,
    a: (props) => {
      if (props.href && props.href.startsWith("#")) {
        return <TOCLink {...props} callback={onTOCLinkClick} />;
      }
      return <a {...props} />;
    },
  };

  return (
    <Grid
      data-testid="constitution-page-wrapper"
      container
      position="relative"
      justifyContent={{ xxs: "flex-start", md: "flex-end" }}
      flex={1}
    >
      <Grid mt={3} item xxs={12} md={isOpen ? 8 : 11} display="flex">
        <Box display="flex" flexDirection="column" flex={1}>
          <ContentWrapper>
            <Box px={{ xxs: 3, md: 5 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                pb={4}
              >
                <Typography variant="headline4">{t("title")}</Typography>
                <IconButton
                  data-testid="open-constitution-drawer-button"
                  onClick={() => setIsOpen(true)}
                  sx={{
                    bgcolor: customPalette.arcticWhite,
                    display: { xxs: "flex", md: "none" },
                    justifyContent: "center",
                  }}
                >
                  <img src={IMAGES.bookOpen} />
                </IconButton>
              </Box>
              <Card
                sx={{ px: { xxs: 2, md: 7 }, py: { xxs: 1, md: 6 } }}
                dataTestId="constitution-content"
              >
                <MDXRemote {...constitution} components={MDXComponents} />
              </Card>
            </Box>
          </ContentWrapper>
          <Footer />
        </Box>
      </Grid>
    </Grid>
  );
}