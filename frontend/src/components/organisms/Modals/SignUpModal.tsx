"use client";
import { useSnackbar } from "@/context/snackbar";
import { deleteUserPhoto, editUser, uploadUserPhoto } from "@/lib/api";
import {
  Button,
  ModalActions,
  ModalContents,
  ModalHeader,
  ModalWrapper,
  Tooltip,
  Typography,
} from "@atoms";
import {
  ICONS,
  IMAGES,
  PATTERNS,
  PROFILE_PICTURE_MAX_FILE_SIZE,
} from "@consts";
import { useAppContext, useModal } from "@context";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, CircularProgress } from "@mui/material";
import { isResponseErrorI } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ControlledField } from "../ControlledField";
import { SignupModalState } from "../types";
import { useScreenDimension } from "@/lib/hooks";

export const SignUpModal = () => {
  const { state, closeModal } = useModal<SignupModalState>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const { userSession, user, fetchUserData } = useAppContext();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const { isMobile } = useScreenDimension();
  const router = useRouter();

  const t = useTranslations("Modals");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    resetField,
  } = useForm();

  const userPhoto = watch("file");

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

  const deleteImage = async () => {
    setDeleting(true);
    if (user.profile_photo_url) {
      const res = await deleteUserPhoto(userSession?.userId);
      if (isResponseErrorI(res)) {
        handleError(res.error);
      } else {
        addSuccessAlert(t("signUp.alerts.successRemovedPhoto"));
        await fetchUserData(userSession?.userId);
      }
    } else {
      resetField("file");
      setValue("file", null);
    }
    setDeleting(false);
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
    const editUserRes = await editUser(
      userSession?.userId,
      userData,
      userData.hotAddress
    );

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
          {state.description && (
            <Typography variant="body1" fontWeight={500}>
              {state.description}
            </Typography>
          )}
          <ControlledField.Input
            label={t("signUp.fields.displayName.label")}
            errors={errors}
            control={control}
            {...register("name", {
              maxLength: {
                value: 64,
                message: "Display name cannot exceed 64 characters",
              },
              pattern: {
                value: PATTERNS.username,
                message:
                  "Display name can only contain letters, numbers, spaces, underscores, pipes, and periods",
              },
              required: "Display name is required",
            })}
          />

          <ControlledField.Input
            label={
              <Tooltip
                heading={t("signUp.fields.hotCredential.label")}
                paragraphOne={t("signUp.fields.hotCredential.tooltip")}
                placement="bottom-end"
                arrow
              >
                <Box width="max-content" display="flex" alignItems="center">
                  {t("signUp.fields.hotCredential.label")}
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
            maxLength={500}
            {...register("description")}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <ControlledField.Upload
              fullWidth={false}
              size="large"
              errors={errors}
              defaultValue={watch("file")}
              control={control}
              style={{ width: "206px" }}
              accept="image/png, image/jpg, image/jpeg"
              dataTestId="upload-profile-photo-button"
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
            {(user.profile_photo_url || userPhoto) && (
              <Button
                variant="outlined"
                startIcon={
                  isDeleting ? (
                    <CircularProgress color="inherit" size="14px" />
                  ) : (
                    <img src={ICONS.trash} />
                  )
                }
                onClick={deleteImage}
                style={{
                  marginLeft: isMobile ? 0 : 10,
                  marginTop: isMobile ? 10 : 0,
                  maxWidth: "206px",
                }}
                disabled={isDeleting ? true : false}
              >
                {t("signUp.fields.deletePhoto")}
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {state.showCloseButton ? (
              <ModalActions isSubmitting={isSubmitting} />
            ) : (
              <Button
                data-testid="sign-up-modal-button"
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
