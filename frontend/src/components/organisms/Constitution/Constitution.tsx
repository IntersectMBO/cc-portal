"use client";

import { ContentWrapper, Typography } from "@/components/atoms";
import { customPalette, IMAGES } from "@consts";
import { useScreenDimension } from "@hooks";
import { Box, Grid, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { MDXRemote } from "next-mdx-remote";
import { useEffect, useState } from "react";
import { Footer } from "../Footer";
import { DrawerMobile } from "../TopNavigation";
import { ConstitutionProps } from "../types";
import { ConstitutionSidebar } from "./ConstitutionSidebar";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading5,
  ListItem,
  NavDrawerDesktop,
  Paragraph,
  TABLE_OF_CONTENTS_WRAPPER_STYLE_PROPS
} from "./MDXComponents";
import { TocAccordion } from "./TOCAccordion";
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
          top={{ xxs: 0, md: 85 }}
          left={0}
        >
          <ConstitutionSidebar tableOfContents={children} metadata={metadata} />
        </NavDrawerDesktop>
      ),
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h5: Heading5,
    p: Paragraph,
    li: ListItem,
    code: Code,
    ol: (props) => {
      //make sure we render ol from toc with TocAccordion otherwise return default
      if (props.className && props.className.includes("toc-level")) {
        return <TocAccordion {...props} />;
      }
      return <ol style={{ color: customPalette.textGray }} {...props} />;
    },
    a: (props) => {
      if (props.href && props.href.startsWith("#")) {
        return <TOCLink {...props} callback={onTOCLinkClick} />;
      }
      return <a {...props} />;
    }
  };

  return (
    <Grid
      data-testid="constitution-page-wrapper"
      container
      position="relative"
      justifyContent={{ xxs: "flex-start" }}
      flex={1}
    >
      {/* fake elemnt to push content to the right since tos is fixed on left */}
      <Box
        height={{ xss: "0", md: "100%" }}
        width={{ xss: "0", md: "420px" }}
        zIndex={-1}
      >
        &nbsp;
      </Box>
      <Grid mt={3} item xxs={12} md={isOpen ? 8 : 11}>
        <Box display="flex" flexDirection="column" flex={1}>
          <ContentWrapper>
            <Box px={{ xxs: 3, md: 5 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                position={{ xxs: "sticky", md: "static" }}
                top="72px"
                bgcolor={customPalette.bgWhite}
              >
                <Typography variant="headline4">{t("title")}</Typography>
                <IconButton
                  data-testid="open-constitution-drawer-button"
                  onClick={() => setIsOpen(true)}
                  sx={{
                    bgcolor: customPalette.arcticWhite,
                    display: { xxs: "flex", md: "none" },
                    justifyContent: "center"
                  }}
                >
                  <img src={IMAGES.docSearch} />
                </IconButton>
              </Box>
              <Box data-testid="constitution-content" pt={4}>
                <MDXRemote {...constitution} components={MDXComponents} />
              </Box>
            </Box>
          </ContentWrapper>
          <Footer bgColor={customPalette.bgWhite} />
        </Box>
      </Grid>
    </Grid>
  );
}
