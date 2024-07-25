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
import { IMAGES, PATTERNS, PROFILE_PICTURE_MAX_FILE_SIZE } from "@consts";
import { Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { SignupModalState } from "../types";
import { editUser, uploadUserPhoto } from "@/lib/api";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/context/snackbar";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/navigation";
import { isResponseErrorI } from "@utils";

export const SignUpModal = () => {
  const { state, closeModal } = useModal<SignupModalState>();
  const [isSubmitting, setSubmitting] = useState(false);
  const { userSession, user, fetchUserData } = useAppContext();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const router = useRouter();

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

  const handleError = (errorMsg) => {
    addErrorAlert(errorMsg);
    router.refresh();
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await uploadUserPhoto(userSession?.userId, formData);
    if (isResponseErrorI(res)) {
      handleError(res.error);
    }
    return res;
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { file, ...userData } = data;
    if (file) {
      const uploadImageRes = await uploadImage(file);
      if (isResponseErrorI(uploadImageRes)) {
        setSubmitting(false);
        return;
      }
    }
    const editUserRes = await editUser(userSession?.userId, userData);

    if (isResponseErrorI(editUserRes)) {
      handleError(editUserRes.error);
    } else {
      addSuccessAlert(t("signUp.alerts.success"));
      await fetchUserData(userSession?.userId);
      closeModal();
    }
    setSubmitting(false);
  };

  return (
    <ModalWrapper dataTestId="sign-up-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{state.title}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <ControlledField.Input
            label={t("signUp.fields.username.label")}
            errors={errors}
            control={control}
            {...register("name", { required: "Username is required" })}
          />
          <ControlledField.Input
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
            {...register("hotAddress", {
              pattern: {
                value: PATTERNS.hotAddress,
                message: "Entered value does not match the expected format",
              },
            })}
          />
          <ControlledField.TextArea
            label={t("signUp.fields.description.label")}
            errors={errors}
            control={control}
            {...register("description")}
          />

          <ControlledField.Upload
            fullWidth={false}
            size="large"
            errors={errors}
            control={control}
            accept="image/png, image/jpg, image/jpeg"
            {...register("file", {
              validate: {
                fileType: (file) =>
                  !file ||
                  file.type === "image/png" ||
                  file.type === "image/jpg" ||
                  file.type === "image/jpeg" ||
                  "The file type should be jpg, png or jpeg",
                fileSize: (file) =>
                  !file ||
                  file.size / (1024 * 1024) < PROFILE_PICTURE_MAX_FILE_SIZE ||
                  "The file size should be less than 5MB",
              },
            })}
          >
            {t("signUp.fields.upload")}
          </ControlledField.Upload>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {state.showCloseButton ? (
              <ModalActions isSubmitting={isSubmitting} />
            ) : (
              <Button
                startIcon={
                  isSubmitting && (
                    <CircularProgress color="inherit" size="14px" />
                  )
                }
                type="submit"
              >
                {t("common.confirm")}
              </Button>
            )}
          </Box>
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
