"use client";
import { Loading } from "@/components/molecules";
import { customPalette, IMAGES, poppins } from "@/constants";
import { useSnackbar } from "@/context/snackbar";
import { getConstitutionByCid } from "@/lib/api";
import { useScreenDimension } from "@/lib/hooks";
import { ContentWrapper, Typography } from "@atoms";
import { Box, Grid, IconButton, Paper } from "@mui/material";
import { isResponseErrorI } from "@utils";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { Footer } from "../Footer";
import { DrawerMobile } from "../TopNavigation";
import {
  CompareConstitutionState,
  ConstitutionMetadata,
  TargetConstitutionState
} from "../types";
import { NavDrawerDesktop } from "./MDXComponents";
import { VersionHistorySidebar } from "./VersionHistorySidebar";

export function VersionHistory({ metadata }) {
  const { screenWidth } = useScreenDimension();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = screenWidth < 1025;
  const t = useTranslations("Modals");

  const { addErrorAlert } = useSnackbar();
  const [currentVersion, setCurrentVersion] = useState("");
  const [targetVersion, setTargetVersion] = useState("");
  const [compareState, setCompareState] = useState<CompareConstitutionState>({
    base: metadata[0],
    target: metadata[1]
  });

  const { base, target } = compareState;

  const TitleBlock = ({ title, created_date }: TargetConstitutionState) => (
    <Box mb={3}>
      <Typography sx={{ marginBottom: 0.5 }} variant="body1">
        {title}
      </Typography>
      <Typography variant="caption">{created_date}</Typography>
    </Box>
  );

  useEffect(() => {
    let ignore = false;
    setCurrentVersion(null);
    setTargetVersion(null);

    async function fetchVersions({
      base,
      target
    }: Pick<CompareConstitutionState, "base" | "target">) {
      const currentVersion = await getConstitutionByCid(base.cid);
      const targetVersion = await getConstitutionByCid(target.cid);
      if (isResponseErrorI(currentVersion) || isResponseErrorI(targetVersion)) {
        addErrorAlert(t("compareConstitution.alerts.error"));
      } else {
        if (!ignore) {
          setCurrentVersion(currentVersion.contents);
          setTargetVersion(targetVersion.contents);
        }
      }
    }

    if (base && target) {
      fetchVersions({ base, target });
    }
    return () => {
      ignore = true;
    };
  }, [base, target]);

  const onCompare = useCallback(
    (target: ConstitutionMetadata) => {
      setCompareState({
        base: metadata[0],
        target
      });
    },
    [metadata]
  );

  return (
    <>
      {isMobile ? (
        <DrawerMobile
          isDrawerOpen={isOpen}
          setIsDrawerOpen={setIsOpen}
          rowGap={0}
        >
          <VersionHistorySidebar
            metadata={metadata}
            onCompare={onCompare}
            ativeTarget={target.cid}
          />
        </DrawerMobile>
      ) : (
        <NavDrawerDesktop top={{ xxs: 0, md: 85 }} left={0}>
          <VersionHistorySidebar
            metadata={metadata}
            onCompare={onCompare}
            ativeTarget={target.cid}
          />
        </NavDrawerDesktop>
      )}
      <Grid
        data-testid="constitution-page-wrapper"
        container
        position="relative"
        justifyContent={{ xxs: "center", lg: "flex-start" }}
        flex={1}
      >
        <Grid
          mt={3}
          item
          xxs={12}
          md={isOpen ? 8 : 11}
          ml={{ xxs: 0, lg: "404px" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            flex={1}
            gap={1}
            minHeight="calc(100vh - 118px)"
          >
            <ContentWrapper>
              <Box px={{ xxs: 2, lg: 5 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  position={{ xxs: "sticky", lg: "static" }}
                  top={{ xxs: "72px", md: "104px" }}
                  bgcolor={customPalette.bgWhite}
                >
                  <Typography variant="headline4">
                    {t("compareConstitution.headline")}
                  </Typography>
                  <IconButton
                    data-testid="open-constitution-drawer-button"
                    onClick={() => setIsOpen(true)}
                    sx={{
                      bgcolor: customPalette.arcticWhite,
                      display: { xxs: "flex", lg: "none" },
                      justifyContent: "center"
                    }}
                  >
                    <img src={IMAGES.docSearch} />
                  </IconButton>
                </Box>
                <Box
                  data-testid="constitution-version-content-compare"
                  pt={4}
                  bgcolor={customPalette.bgWhite}
                >
                  {currentVersion && targetVersion ? (
                    <Paper
                      sx={{
                        padding: { xxs: "32px 0", md: "32px 24px" },
                        overflowX: "auto",
                        overflowY: "hidden"
                      }}
                    >
                      <ReactDiffViewer
                        oldValue={targetVersion}
                        newValue={currentVersion}
                        hideLineNumbers={true}
                        splitView={!isMobile}
                        disableWordDiff
                        leftTitle={<TitleBlock {...target} />}
                        rightTitle={<TitleBlock {...base} />}
                        styles={{
                          variables: {
                            light: {
                              diffViewerBackground: "white",
                              diffViewerTitleBackground: "white",
                              codeFoldBackground: "white",
                              emptyLineBackground: "white",
                              diffViewerColor: customPalette.textBlack
                            }
                          },
                          diffContainer: {
                            fontSize: "16px",
                            lineHeight: "1.6",
                            borderRadius: "16px"
                          },
                          contentText: {
                            fontFamily: poppins.style.fontFamily
                          }
                        }}
                      />
                    </Paper>
                  ) : (
                    <Loading />
                  )}
                </Box>
              </Box>
            </ContentWrapper>
            <Box mt="auto">
              <Footer bgColor={customPalette.bgWhite} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
