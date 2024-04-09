import { ModalContents, ModalHeader, ModalWrapper, Typography } from "@atoms";
import { IMAGES } from "@consts";
import { useTranslations } from "next-intl";
import { ModalActions } from "@atoms";
import { Field } from "@molecules";

export const AddMemberModal = () => {
  const t = useTranslations("Modals");

  const roles = ["Admin", "Constitutional member"];
  const permissions = [
    "All",
    "Manage constitutional members",
    "Upload Constitution version",
    "Add new admin members",
  ];

  const handleChange = (value) => {
    console.log(value);
  };

  return (
    <ModalWrapper dataTestId="add-member-modal" icon={IMAGES.pastelAddMember}>
      <ModalHeader>{t("addMember.headline")}</ModalHeader>
      <ModalContents>
        <Field.Input
          placeholder={t("addMember.fields.email.placeholder")}
          label={t("addMember.fields.email.label")}
          value=""
        />
        <Field.MultipleSelect
          placeholder={t("addMember.fields.role.placeholder")}
          label={t("addMember.fields.role.label")}
          items={roles}
          onChange={handleChange}
        />
        <Field.MultipleSelect
          placeholder={t("addMember.fields.permissions.placeholder")}
          label={t("addMember.fields.permissions.label")}
          items={permissions}
          onChange={handleChange}
        />
        <ModalActions onConfirm={() => console.log("confirm")} />
      </ModalContents>
    </ModalWrapper>
  );
};
