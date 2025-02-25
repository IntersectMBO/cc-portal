"use client";
import { Button } from "@/components/atoms/Button";
import { IMAGES, PATHS } from "@/constants";
import { useModal } from "@context";
import { Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { HeroActionsProps } from "../types";

export function HeroActions({ role }: HeroActionsProps) {
  const t = useTranslations("Index");
  const { openModal } = useModal();
  const isAmdmin = role === "admin";
  return (
    <Grid
      container
      flexDirection={{ xxs: "column", md: "row" }}
      gap={1}
      sx={{ position: "absolute" }}
    >
      {isAmdmin ? (
        <>
          <Grid item>
            <Button
              size="large"
              startIcon={<img src={IMAGES.login} />}
              onClick={() => {
                openModal({
                  type: "signIn",
                });
              }}
              data-testid="admin-hero-sign-in-button"
            >
              {t("hero.signIn")}
            </Button>
          </Grid>
          <Grid item>
            <Link href={PATHS.home}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<img src={IMAGES.bookOpen} />}
                data-testid="admin-hero-const-comitee-portal-button"
              >
                {t("hero.constitutionalCommitteePortal")}
              </Button>
            </Link>
          </Grid>
        </>
      ) : (
        <Grid
          item
          display="flex"
          gap={2}
          flexDirection={{ xxs: "column", lg: "row" }}
        >
          <Link href={PATHS.constitution}>
            <Button
              size="large"
              data-testid="hero-see-constitution-button"
              startIcon={
                <img
                  src={IMAGES.readingBook}
                  style={{ width: "30px", height: "30px" }}
                />
              }
            >
              {t("hero.seeConstitution")}
            </Button>
          </Link>
        </Grid>
      )}
    </Grid>
  );
}
