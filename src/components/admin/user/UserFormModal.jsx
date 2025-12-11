import React from "react";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultUserFormFields,
  defaultUserValidationRules,
  editUserFormFields,
} from "./userFormConfig";

const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields,
  validationRules = defaultUserValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
}) => {
  // Use appropriate fields based on mode if not explicitly provided
  const formFields =
    fields || (mode === "edit" ? editUserFormFields : defaultUserFormFields);

  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản";
  const defaultIcon = mode === "add" ? "➕" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo tài khoản" : "Cập nhật";

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (formData) => {
    onSubmit(formData);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || defaultTitle}
      icon={icon || defaultIcon}
      maxWidth="500px"
    >
      <GenericForm
        fields={formFields}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel={submitLabel || defaultSubmitLabel}
        cancelLabel={cancelLabel}
        isLoading={isLoading}
        initialData={initialData}
        validationRules={validationRules}
      />
    </GenericModal>
  );
};

export default UserFormModal;
