import React, { useState, useEffect } from "react";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultLessonFormFields,
  defaultLessonValidationRules,
} from "./lessonFormConfig";

const LessonFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields = defaultLessonFormFields,
  validationRules = defaultLessonValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
  subjects = [], // Available subjects for the select field
  topics = [], // Available topics for the select field
  preSelectedFilters = {}, // Pre-selected filters from parent component
}) => {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm bài học mới" : "Chỉnh sửa bài học";
  const defaultIcon = mode === "add" ? "📖" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo bài học" : "Cập nhật";

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

  // Initialize selected values when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit") {
        // For edit mode, use data from initialData
        const topic = safeInitialData.topicId;
        const subject = topic?.subjectId;
        const grade = subject?.grade?.toString() || "";

        setSelectedGrade(grade);
        setSelectedSubject(subject?._id || "");
      } else if (mode === "add") {
        // For add mode, use pre-selected filters from parent component
        const grade = preSelectedFilters.grade || "";
        const subjectName = preSelectedFilters.subject || "";

        // Find subject ID from subject name
        const foundSubject = subjects.find(
          (subject) => subject.name === subjectName
        );
        const subjectId = foundSubject?._id || "";

        setSelectedGrade(grade);
        setSelectedSubject(subjectId);
      }
    }
  }, [isOpen, safeInitialData.topicId, mode, preSelectedFilters, subjects]);

  const handleClose = () => {
    setSelectedGrade("");
    setSelectedSubject("");
    onClose();
  };

  const handleSubmit = (formData) => {
    // Remove grade and subjectId from form data as they're only used for filtering
    // eslint-disable-next-line no-unused-vars
    const { grade, subjectId, ...lessonData } = formData;
    onSubmit(lessonData);
  };

  // Filter subjects based on selected grade
  const getFilteredSubjects = (grade) => {
    if (!grade) return [];
    return subjects.filter((subject) => subject.grade?.toString() === grade);
  };

  // Filter topics based on selected subject
  const getFilteredTopics = (subjectId) => {
    if (!subjectId) return [];
    return topics.filter(
      (topic) =>
        topic.subjectId?._id === subjectId || topic.subjectId === subjectId
    );
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

    if (field.name === "topicId") {
      const filteredTopics = getFilteredTopics(selectedSubject);
      return {
        ...field,
        options: filteredTopics.map((topic) => ({
          value: topic._id,
          label: topic.title,
        })),
        disabled: !selectedSubject, // Disable if no subject selected
      };
    }

    return field;
  });

  // Handle field value changes for cascading effect
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "grade") {
      setSelectedGrade(value);
      setSelectedSubject("");
      // Reset both subjectId and topicId when grade changes
      return { grade: value, subjectId: "", topicId: "" };
    }

    if (fieldName === "subjectId") {
      setSelectedSubject(value);
      // Reset topicId when subject changes
      return { subjectId: value, topicId: "" };
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
              ? safeInitialData.topicId?.subjectId?.grade?.toString() || ""
              : preSelectedFilters.grade || "",
          subjectId:
            mode === "edit"
              ? safeInitialData.topicId?.subjectId?._id ||
                safeInitialData.topicId?.subjectId ||
                ""
              : subjects.find((s) => s.name === preSelectedFilters.subject)
                  ?._id || "",
          topicId:
            mode === "edit"
              ? safeInitialData.topicId?._id || safeInitialData.topicId || ""
              : topics.find((t) => t.title === preSelectedFilters.topic)?._id ||
                "",
          title: safeInitialData.title || "",
          urlVideo: safeInitialData.urlVideo || "",
        }}
        validationRules={validationRules}
        onFieldChange={handleFieldChange}
      />
    </GenericModal>
  );
};

export default LessonFormModal;
