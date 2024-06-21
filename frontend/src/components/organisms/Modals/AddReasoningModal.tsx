"use client";
import React from "react";
import {
  ModalWrapper,
  ModalHeader,
  ModalContents,
  ModalActions,
  Typography,
} from "@atoms";
import { useForm } from "react-hook-form";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ControlledField } from "@organisms";
import { useModal } from "@context";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbar";

interface AddReasoningFormData {
  title: string;
  reasoning: string;
}
export const AddReasoningModal = () => {
  const t = useTranslations("Modals");
  const {
    state: { callback },
  } = useModal();
  const router = useRouter();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = async (data: AddReasoningFormData) => {
    try {
      router.refresh();
      addSuccessAlert(t("addReasoning.alerts.success"));
    } catch (error) {
      addErrorAlert(t("addReasoning.alerts.error"));
    } finally {
      callback();
    }
  };

  return (
    <ModalWrapper
      dataTestId="add-reasoning-modal"
      icon={IMAGES.pastelReasoning}
    >
      <ModalHeader>{t("addReasoning.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
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
            {...register("reasoning", { required: "Reasoning is required" })}
          />

          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
