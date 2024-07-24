"use client";
import React, { useState } from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContents,
  ModalActions,
  Typography,
} from "@atoms";
import { useForm } from "react-hook-form";
import { customPalette, IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ControlledField } from "@organisms";
import { useModal } from "@context";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbar";
import { OpenAddReasoningModalState } from "../types";
import { addOrUpdateReasoning } from "@/lib/api";
import { ReasoningResponseI } from "@/lib/requests";
import { isResponseErrorI } from "@utils";

interface AddReasoningFormData {
  title: string;
  content: string;
}
export const AddReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { callback, id },
  } = useModal<OpenAddReasoningModalState>();
  const router = useRouter();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data: AddReasoningFormData) => {
    setSubmitting(true);
    const response = await addOrUpdateReasoning({ proposalId: id, ...data });
    if (isResponseErrorI(response)) {
      addErrorAlert(t("addReasoning.alerts.error"));
    } else {
      router.refresh();
      addSuccessAlert(t("addReasoning.alerts.success"));
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
        {t("addReasoning.headline")}
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography
            variant="body2"
            fontWeight={400}
            color={customPalette.textGray}
          >
            {t("addReasoning.description")}
          </Typography>
          <ControlledField.Input
            placeholder={t("addReasoning.fields.title.placeholder")}
            label={t("addReasoning.fields.title.label")}
            errors={errors}
            control={control}
            {...register("title", { required: "Title is required" })}
          />

          <ControlledField.TextArea
            placeholder={t("addReasoning.fields.reasoning.placeholder")}
            label={t("addReasoning.fields.reasoning.label")}
            errors={errors}
            control={control}
            {...register("content", { required: "Reasoning is required" })}
          />

          <ModalActions isSubmitting={isSubmitting} />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
