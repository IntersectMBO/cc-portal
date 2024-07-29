"use client";
import { Button } from "@/components/atoms/Button";
import { ICONS, IMAGES, PATHS } from "@/constants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useModal } from "@context";
import { Grid } from "@mui/material";
import { HeroActionsProps } from "../types";

export function HeroActions({ role }: HeroActionsProps) {
  const t = useTranslations("Index");
  const { openModal } = useModal();
  const isAmdmin = role === "admin";
  return (
    <Grid container gap={1}>
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
              >
                {t("hero.constitutionalCommitteePortal")}
              </Button>
            </Link>
          </Grid>
        </>
      ) : (
        <Grid item>
          <Link href={PATHS.constitution}>
            <Button size="large" startIcon={<img src={ICONS.rocketLaunch} />}>
              {t("hero.seeConstitution")}
            </Button>
          </Link>
        </Grid>
      )}
    </Grid>
  );
}
