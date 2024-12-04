"use client";
import { useSnackbar } from "@/context/snackbar";
import { addOrUpdateReasoning } from "@/lib/api";
import { ReasoningResponseI } from "@/lib/requests";
import {
  ModalActions,
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography
} from "@atoms";
import { customPalette, IMAGES } from "@consts";
import { useModal } from "@context";
import { ControlledField } from "@organisms";
import { isResponseErrorI } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { OpenAddReasoningModalState } from "../types";

interface AddReasoningFormData {
  title: string;
  content: string;
}
export const AddReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { callback, id }
  } = useModal<OpenAddReasoningModalState>();
  const router = useRouter();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm();

  const onSubmit = async (data: AddReasoningFormData) => {
    setSubmitting(true);
    const response = await addOrUpdateReasoning({ proposalId: id, ...data });
    if (isResponseErrorI(response)) {
      addErrorAlert(t("addRationale.alerts.error"));
    } else {
      router.refresh();
      addSuccessAlert(t("addRationale.alerts.success"));
      callback(response as ReasoningResponseI);
    }
    setSubmitting(false);
  };

  return (
    <ModalWrapper
      dataTestId="add-reasoning-modal"
      icon={IMAGES.pastelReasoning}
    >
      <ModalHeader sx={{ marginTop: "16px" }}>
        {t("addRationale.headline")}
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography
            variant="body2"
            fontWeight={400}
            color={customPalette.textGray}
          >
            {t("addRationale.description")}
          </Typography>
          <ControlledField.TextArea
            label={t("addRationale.fields.title.label")}
            errors={errors}
            control={control}
            maxLength={200}
            {...register("title", { required: "Summary is required" })}
          />

          <ControlledField.TextArea
            label={t("addRationale.fields.rationale.label")}
            errors={errors}
            control={control}
            {...register("content", {
              required: "Rationale Statement is required"
            })}
          />

          <ModalActions isSubmitting={isSubmitting} />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
