import React from "react";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultBadgeFormFields,
  defaultBadgeValidationRules,
} from "./badgeFormConfig";

const BadgeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields = defaultBadgeFormFields,
  validationRules = defaultBadgeValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
}) => {
  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm huy hiệu mới" : "Chỉnh sửa huy hiệu";
  const defaultIcon = mode === "add" ? "🏆" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo huy hiệu" : "Cập nhật";

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (formData) => {
    // Convert flat form data to nested structure for condition
    const badgeData = {
      title: formData.title,
      description: formData.description,
      icon: formData.icon,
      category: formData.category,
      rewardNuts: parseInt(formData.rewardNuts) || 0,
      condition: {
        type: formData["condition.type"],
        value: parseInt(formData["condition.value"]),
        subject: formData["condition.subject"],
      },
    };
    onSubmit(badgeData);
  };

  // Convert nested initial data to flat structure for form
  const getFlatInitialData = () => {
    return {
      title: safeInitialData.title || "",
      description: safeInitialData.description || "",
      icon: safeInitialData.icon || "🏆",
      category: safeInitialData.category || "chuyencan",
      rewardNuts: safeInitialData.rewardNuts || 0,
      "condition.type": safeInitialData.condition?.type || "days_in_row",
      "condition.value": safeInitialData.condition?.value || 1,
      "condition.subject": safeInitialData.condition?.subject || "any",
    };
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
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel={submitLabel || defaultSubmitLabel}
        cancelLabel={cancelLabel}
        isLoading={isLoading}
        initialData={getFlatInitialData()}
        validationRules={validationRules}
      />
    </GenericModal>
  );
};

export default BadgeFormModal;
