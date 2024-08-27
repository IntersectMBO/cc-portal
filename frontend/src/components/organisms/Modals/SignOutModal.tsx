import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
} from "@/components/atoms";
import { IMAGES } from "@/constants";
import { useTranslations } from "next-intl";
import { ModalActions } from "@/components/atoms";

export const SignOutModal = () => {
  const t = useTranslations("Modals");

  return (
    <ModalWrapper dataTestId="sign-out-modal" icon={IMAGES.pastelSignOut}>
      <ModalHeader>{t("signOut.headline")}</ModalHeader>
      <ModalContents>
        <Typography variant="body1" fontWeight={500}>
          {t("signOut.description")}
        </Typography>
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
