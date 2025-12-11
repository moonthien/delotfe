import React from "react";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultSubjectFormFields,
  defaultSubjectValidationRules,
} from "./subjectFormConfig";

const SubjectFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields = defaultSubjectFormFields,
  validationRules = defaultSubjectValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
  preSelectedFilters = {}, // Pre-selected filters from parent component
}) => {
  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm môn học mới" : "Chỉnh sửa môn học";
  const defaultIcon = mode === "add" ? "➕" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo môn học" : "Cập nhật";

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (formData) => {
    // Convert grade and tap to numbers
    const processedData = {
      ...formData,
      grade: parseInt(formData.grade) || 1,
      tap: parseInt(formData.tap) || 1,
    };
    onSubmit(processedData);
  };

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

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
        initialData={{
          name: safeInitialData.name || "",
          // Convert numbers to strings for form inputs
          grade:
            mode === "edit"
              ? safeInitialData.grade?.toString() || ""
              : preSelectedFilters.grade || "",
          tap:
            mode === "edit"
              ? safeInitialData.tap?.toString() || ""
              : preSelectedFilters.tap || "",
        }}
        validationRules={validationRules}
      />
    </GenericModal>
  );
};

export default SubjectFormModal;
