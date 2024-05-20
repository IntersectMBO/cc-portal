"use client";
import { useAppContext, useModal } from "@context";
import {
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Typography,
  Button,
  ModalActions,
  Tooltip,
} from "@atoms";
import { IMAGES } from "@consts";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { SignupModalState } from "../types";
import { editUser, uploadUserPhoto } from "@/lib/api";
import { useEffect } from "react";
import { useSnackbar } from "@/context/snackbar";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const SignUpModal = () => {
  const { state, closeModal } = useModal<SignupModalState>();
  const { userSession, user, fetchUserData } = useAppContext();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();

  const t = useTranslations("Modals");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  useEffect(() => {
    // Populate form fields with user data when the component mounts
    if (user) {
      setValue("name", user.name || "");
      setValue("hotAddress", user.hot_addresses || "");
      setValue("description", user.description || "");
    }
  }, [user, setValue]);

  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      await uploadUserPhoto(userSession.userId, formData);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      const { file, ...userData } = data;
      if (file) {
        await uploadImage(file);
      }
      await editUser(userSession.userId, userData);
      await fetchUserData(userSession.userId);
      closeModal();
      addSuccessAlert(t("signUp.alerts.success"));
    } catch (error) {
      addErrorAlert(t("signUp.alerts.error"));
    }
  };

  return (
    <ModalWrapper dataTestId="sign-up-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{state.title}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <Typography variant="body1" fontWeight={500}>
            {state.description}
          </Typography>

          <ControlledField.Input
            placeholder={t("signUp.fields.username.placeholder")}
            label={t("signUp.fields.username.label")}
            errors={errors}
            control={control}
            {...register("name", { required: "Username is required" })}
          />
          <ControlledField.Input
            placeholder={t("signUp.fields.hotAddress.placeholder")}
            label={
              <Tooltip
                heading={t("signUp.fields.hotAddress.label")}
                paragraphOne={t("signUp.fields.hotAddress.tooltip")}
                placement="bottom-end"
                arrow
              >
                <Box width="max-content" display="flex" alignItems="center">
                  {t("signUp.fields.hotAddress.label")}
                  <InfoOutlinedIcon
                    style={{
                      color: "#ADAEAD",
                    }}
                    sx={{ ml: 0.7 }}
                    fontSize="small"
                  />
                </Box>
              </Tooltip>
            }
            errors={errors}
            control={control}
            {...register("hotAddress")}
          />
          <ControlledField.TextArea
            placeholder={t("signUp.fields.description.placeholder")}
            label={t("signUp.fields.description.label")}
            helpfulText={t("signUp.fields.description.helpfulText")}
            errors={errors}
            control={control}
            {...register("description")}
          />

          <ControlledField.Upload
            fullWidth={false}
            size="large"
            errors={errors}
            control={control}
            {...register("file")}
          >
            {t("signUp.fields.upload")}
          </ControlledField.Upload>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {state.showCloseButton ? (
              <ModalActions />
            ) : (
              <Button type="submit">{t("common.confirm")}</Button>
            )}
          </Box>
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
