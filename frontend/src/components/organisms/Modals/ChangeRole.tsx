"use client";
import { SeletItem } from "@/components/molecules";
import { useSnackbar } from "@/context/snackbar";
import { registerAdmin, registerUser } from "@/lib/api";
import { Permissions, UserRole } from "@/lib/requests";
import { ModalActions, ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import { getRoleDropdownList, IMAGES, permissionsList } from "@consts";
import { useAppContext, useModal } from "@context";
import { ControlledField } from "@organisms";
import { isAdminRole } from "@utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

interface AddMemberFormData {
  email: string;
  permissions: Permissions[];
  role: UserRole;
}
export const ChangeRole = () => {
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
    control
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
      addSuccessAlert(t("changeRole.alerts.success"));
    }
    closeModal();
    router.refresh();
  };

  return (
    <ModalWrapper dataTestId="add-member-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{t("changeRole.headline")}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContents>
          <ControlledField.Select
            placeholder={t("changeRole.fields.role.placeholder")}
            label={t("changeRole.fields.role.label")}
            items={roleList as SeletItem[]}
            control={control}
            errors={errors}
            multiple={false}
            dataTestId="add-member-role"
            {...register("role", { required: "Role is required" })}
          />
          {isAdminRole(role) && (
            <ControlledField.Select
              placeholder={t("changeRole.fields.permissions.placeholder")}
              label={t("changeRole.fields.permissions.label")}
              items={permissionsList}
              control={control}
              errors={errors}
              dataTestId="add-member-permission"
              {...register("permissions", {
                required: "Permission is required"
              })}
            />
          )}

          <ModalActions dataTestId="add-member-modal" />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
