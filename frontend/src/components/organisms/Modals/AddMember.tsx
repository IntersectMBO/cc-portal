import React from "react";
import { ModalWrapper, ModalHeader, ModalContents, ModalActions } from "@atoms";
import { useForm } from "react-hook-form";
import { IMAGES, permissionsList, rolesList } from "@consts";
import { useTranslations } from "next-intl";
import { ControlledField } from "@organisms";

export const AddMemberModal = () => {
  const t = useTranslations("Modals");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
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
          />
          <ControlledField.Select
            placeholder={t("addMember.fields.role.placeholder")}
            label={t("addMember.fields.role.label")}
            items={rolesList}
            control={control}
            errors={errors}
            multiple={false}
            {...register("role", { required: "Role is required" })}
          />
          <ControlledField.Select
            placeholder={t("addMember.fields.permissions.placeholder")}
            label={t("addMember.fields.permissions.label")}
            items={permissionsList}
            control={control}
            errors={errors}
            {...register("permission")}
          />

          <ModalActions />
        </ModalContents>
      </form>
    </ModalWrapper>
  );
};
