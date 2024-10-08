"use client";
import React from "react";
import { ModalWrapper, ModalHeader, ModalContents, ModalActions } from "@atoms";
import { useForm, useWatch } from "react-hook-form";
import { getRoleDropdownList, IMAGES, permissionsList } from "@consts";
import { useTranslations } from "next-intl";
import { ControlledField } from "@organisms";
import { Permissions, UserRole } from "@/lib/requests";
import { isAdminRole } from "@utils";
import { registerAdmin, registerUser } from "@/lib/api";
import { useAppContext, useModal } from "@context";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbar";
import { SeletItem } from "@/components/molecules";

interface AddMemberFormData {
  email: string;
  permissions: Permissions[];
  role: UserRole;
}
export const AddMemberModal = () => {
  const t = useTranslations("Modals");
  const { closeModal } = useModal();
  const router = useRouter();
  const { addSuccessAlert, addErrorAlert } = useSnackbar();
  const { userSession } = useAppContext();
  const roleList = getRoleDropdownList(userSession.role);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const role = useWatch({ control, name: "role" });

  const onSubmit = async (data: AddMemberFormData) => {
    let res;
    if (isAdminRole(data.role)) {
      res = await registerAdmin(data.email, data.permissions);
    } else {
      res = await registerUser(data.email);
    }
    if (res?.error) {
      addErrorAlert(res.error);
    } else {
      addSuccessAlert(t("addMember.alerts.success"));
    }
    closeModal();
    router.refresh();
  };

  return (
    <ModalWrapper dataTestId="add-member-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{t("addMember.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <ControlledField.Input
            placeholder={t("addMember.fields.email.placeholder")}
            label={t("addMember.fields.email.label")}
            errors={errors}
            control={control}
            {...register("email", { required: "Email is required" })}
            type="email"
            dataTestId="add-member-email"
          />
          <ControlledField.Select
            placeholder={t("addMember.fields.role.placeholder")}
            label={t("addMember.fields.role.label")}
            items={roleList as SeletItem[]}
            control={control}
            errors={errors}
            multiple={false}
            dataTestId="add-member-role"
            {...register("role", { required: "Role is required" })}
          />
          {isAdminRole(role) && (
            <ControlledField.Select
              placeholder={t("addMember.fields.permissions.placeholder")}
              label={t("addMember.fields.permissions.label")}
              items={permissionsList}
              control={control}
              errors={errors}
              dataTestId="add-member-permission"
              {...register("permissions", {
                required: "Permission is required",
              })}
            />
          )}

          <ModalActions dataTestId="add-member-modal" />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
