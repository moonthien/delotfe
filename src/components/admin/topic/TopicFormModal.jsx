import React, { useState, useEffect } from "react";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultTopicFormFields,
  defaultTopicValidationRules,
} from "./topicFormConfig";

const TopicFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields = defaultTopicFormFields,
  validationRules = defaultTopicValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
  subjects = [], // Available subjects for the select field
  preSelectedFilters = {}, // Pre-selected filters from parent component
}) => {
  const [selectedGrade, setSelectedGrade] = useState("");

  // Default titles and labels based on mode
  const defaultTitle = mode === "add" ? "Thêm chủ đề mới" : "Chỉnh sửa chủ đề";
  const defaultIcon = mode === "add" ? "📝" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo chủ đề" : "Cập nhật";

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

  // Initialize selectedGrade when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit") {
        // For edit mode, use data from initialData
        const initialGrade = safeInitialData.subjectId?.grade?.toString() || "";
        setSelectedGrade(initialGrade);
      } else if (mode === "add") {
        // For add mode, use pre-selected filters from parent component
        const grade = preSelectedFilters.grade || "";
        setSelectedGrade(grade);
      }
    }
  }, [isOpen, safeInitialData.subjectId?.grade, mode, preSelectedFilters]);

  const handleClose = () => {
    setSelectedGrade("");
    onClose();
  };

  const handleSubmit = (formData) => {
    // Remove grade from form data as it's only used for filtering
    // eslint-disable-next-line no-unused-vars
    const { grade, ...topicData } = formData;
    onSubmit(topicData);
  };

  // Filter subjects based on selected grade
  const getFilteredSubjects = (grade) => {
    if (!grade) return [];
    return subjects.filter((subject) => subject.grade?.toString() === grade);
  };

  // Populate options in fields with dynamic filtering
  const fieldsWithOptions = fields.map((field) => {
    if (field.name === "subjectId") {
      const filteredSubjects = getFilteredSubjects(selectedGrade);
      return {
        ...field,
        options: filteredSubjects.map((subject) => ({
          value: subject._id,
          label: subject.name,
        })),
        disabled: !selectedGrade, // Disable if no grade selected
      };
    }
    return field;
  });

  // Handle field value changes for cascading effect
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "grade") {
      setSelectedGrade(value);
      // Reset subjectId when grade changes
      return { grade: value, subjectId: "" };
    }
    return { [fieldName]: value };
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
        fields={fieldsWithOptions}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel={submitLabel || defaultSubmitLabel}
        cancelLabel={cancelLabel}
        isLoading={isLoading}
        initialData={{
          grade:
            mode === "edit"
              ? safeInitialData.subjectId?.grade?.toString() || ""
              : preSelectedFilters.grade || "",
          title: safeInitialData.title || "",
          subjectId:
            mode === "edit"
              ? safeInitialData.subjectId?._id ||
                safeInitialData.subjectId ||
                ""
              : subjects.find((s) => s.name === preSelectedFilters.subject)
                  ?._id || "",
        }}
        validationRules={validationRules}
        onFieldChange={handleFieldChange}
      />
    </GenericModal>
  );
};

export default TopicFormModal;
