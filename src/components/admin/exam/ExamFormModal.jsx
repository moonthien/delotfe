import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import GenericModal from "../../common/GenericModal";
import GenericForm from "../../common/GenericForm";
import {
  defaultExamFormFields,
  defaultExamValidationRules,
} from "./examFormConfig";
import { getTopicsBySubject } from "../../../services/apiService";

const ExamFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  mode = "add", // 'add' | 'edit'
  initialData = {},
  title,
  icon,
  fields = defaultExamFormFields,
  validationRules = defaultExamValidationRules,
  submitLabel,
  cancelLabel = "Hủy",
  subjects = [], // Available subjects for the select field
  preSelectedFilters = {}, // Pre-selected filters from parent component
}) => {
  // State for filtered subjects based on selected grade
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");

  // State for topics when examType is "Topic"
  const [topics, setTopics] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // Filter subjects when grade changes or subjects list updates
  useEffect(() => {
    if (selectedGrade && subjects.length > 0) {
      const filtered = subjects.filter((subject) => {
        // Filter by grade
        const matchesGrade =
          subject.grade === selectedGrade ||
          subject.grade === parseInt(selectedGrade);

        // Filter by subject name (only Math and Vietnamese)
        const allowedSubjects = ["Toán", "Tiếng Việt"];
        const matchesSubject = allowedSubjects.some((allowed) =>
          subject.name.toLowerCase().includes(allowed.toLowerCase())
        );

        return matchesGrade && matchesSubject;
      });
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  }, [selectedGrade, subjects]);

  // Initialize grade from initial data or preSelectedFilters
  useEffect(() => {
    if (mode === "edit") {
      // For edit mode, use data from initialData
      if (initialData?.subjectId?.grade) {
        const gradeValue = initialData.subjectId.grade.toString();
        setSelectedGrade(gradeValue);
      } else if (initialData?.grade) {
        const gradeValue = initialData.grade.toString();
        setSelectedGrade(gradeValue);
      }

      if (initialData?.subjectId) {
        // subjectId là object {_id, name, grade}
        const subjectIdValue =
          typeof initialData.subjectId === "string"
            ? initialData.subjectId
            : initialData.subjectId._id;
        setSelectedSubjectId(subjectIdValue);
      }

      if (initialData?.examType) {
        setSelectedExamType(initialData.examType);
      }
    } else if (mode === "add") {
      // For add mode, use pre-selected filters from parent component
      const grade = preSelectedFilters.grade || "";
      const subjectName = preSelectedFilters.subject || "";
      const examType = preSelectedFilters.examType || "";

      // Find subject ID from subject name
      const foundSubject = subjects.find(
        (subject) => subject.name === subjectName
      );
      const subjectId = foundSubject?._id || "";

      setSelectedGrade(grade);
      setSelectedSubjectId(subjectId);
      setSelectedExamType(examType);
    }
  }, [initialData, mode, preSelectedFilters, subjects]);

  // Fetch topics when subject and examType are selected and examType is "Topic"
  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedSubjectId && selectedExamType === "Topic") {
        try {
          const response = await getTopicsBySubject(selectedSubjectId);
          const topicsData = response.data?.data || [];
          setTopics(Array.isArray(topicsData) ? topicsData : []);
        } catch (error) {
          console.error("Error fetching topics:", error);
          toast.error("Có lỗi xảy ra khi tải danh sách chủ đề");
          setTopics([]);
        }
      } else {
        setTopics([]);
      }
    };

    fetchTopics();
  }, [selectedSubjectId, selectedExamType]);

  // Default titles and labels based on mode
  const defaultTitle =
    mode === "add" ? "Thêm bài kiểm tra mới" : "Chỉnh sửa bài kiểm tra";
  const defaultIcon = mode === "add" ? "📋" : "✏️";
  const defaultSubmitLabel = mode === "add" ? "Tạo bài kiểm tra" : "Cập nhật";

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (formData) => {
    // Convert numbers to proper types and format date
    const processedData = {
      ...formData,
      duration: parseInt(formData.duration) || 0,
      totalQuestions: parseInt(formData.totalQuestions) || 0,
      rewardNuts: formData.rewardNuts ? parseInt(formData.rewardNuts) : 0,
      // Convert date to ISO string if provided
      date: formData.date ? new Date(formData.date).toISOString() : null,
    };

    onSubmit(processedData);
  };

  // Ensure we have valid initial data
  const safeInitialData = initialData || {};

  // Populate subject options and add topic field when needed
  const fieldsWithDynamicOptions = useMemo(() => {
    let dynamicFields = [...fields];

    // Add topic field after examType if examType is "Topic"
    if (selectedExamType === "Topic") {
      const examTypeIndex = dynamicFields.findIndex(
        (field) => field.name === "examType"
      );
      if (examTypeIndex !== -1) {
        const topicField = {
          name: "topicId",
          label: "Chủ đề",
          type: "select",
          placeholder: selectedSubjectId
            ? "Chọn chủ đề..."
            : "Vui lòng chọn môn học trước",
          required: true,
          disabled: !selectedSubjectId,
          options: Array.isArray(topics)
            ? topics.map((topic) => ({
                value: topic._id,
                label: topic.title, // Sử dụng title thay vì name
              }))
            : [],
        };
        dynamicFields.splice(examTypeIndex + 1, 0, topicField);
      }
    }

    // Process each field to populate options
    const processedFields = dynamicFields.map((field) => {
      if (field.name === "subjectId") {
        const hasSubjects = filteredSubjects.length > 0;

        if (hasSubjects) {
          // Tạo options từ tất cả subjects đã filter, không remove period info
          const options = filteredSubjects.map((subject) => {
            // Extract display name (remove grade info but keep period)
            let displayName = subject.name;

            // Remove grade info like "3 - " or "Lớp 3"
            displayName = displayName.replace(/^\d+\s*-\s*/, "");
            displayName = displayName.replace(/\s*-\s*Lớp\s*\d+/, "");

            // Clean up any remaining dashes or extra spaces at the end
            displayName = displayName.replace(/\s*-\s*$/, "").trim();

            return {
              value: subject._id,
              label: displayName, // Giữ nguyên thông tin kỳ học
            };
          });

          return {
            ...field,
            options: options,
            disabled: !selectedGrade, // Disable if no grade selected
            placeholder: !selectedGrade
              ? "Vui lòng chọn lớp trước"
              : options.length > 0
              ? "Chọn môn học..."
              : "Không có môn học nào cho lớp này",
          };
        }

        return {
          ...field,
          options: [],
          disabled: !selectedGrade, // Disable if no grade selected
          placeholder: !selectedGrade
            ? "Vui lòng chọn lớp trước"
            : "Không có môn học nào cho lớp này",
        };
      }
      return field;
    });

    return processedFields;
  }, [
    fields,
    selectedExamType,
    selectedSubjectId,
    topics,
    filteredSubjects,
    selectedGrade,
  ]);

  // Handle form field changes to track grade selection
  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "grade") {
      setSelectedGrade(value);
      // Reset subject selection when grade changes
      return { [fieldName]: value, subjectId: "", topicId: "" };
    }

    if (fieldName === "subjectId") {
      setSelectedSubjectId(value);
      // Reset topic selection when subject changes
      return { [fieldName]: value, topicId: "" };
    }

    if (fieldName === "examType") {
      setSelectedExamType(value);
      // Reset topic selection when exam type changes
      if (value !== "Topic") {
        return { [fieldName]: value, topicId: "" };
      }
    }

    return { [fieldName]: value };
  };
  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || defaultTitle}
      icon={icon || defaultIcon}
      maxWidth="600px"
    >
      <GenericForm
        fields={fieldsWithDynamicOptions}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        onFieldChange={handleFieldChange}
        submitLabel={submitLabel || defaultSubmitLabel}
        cancelLabel={cancelLabel}
        isLoading={isLoading}
        initialData={{
          grade:
            mode === "edit"
              ? (() => {
                  if (safeInitialData.subjectId?.grade) {
                    return safeInitialData.subjectId.grade.toString();
                  }
                  return safeInitialData.grade?.toString() || "";
                })()
              : preSelectedFilters.grade || "",
          description: safeInitialData.description || "",
          subjectId:
            mode === "edit"
              ? (() => {
                  if (typeof safeInitialData.subjectId === "string") {
                    return safeInitialData.subjectId;
                  } else if (safeInitialData.subjectId?._id) {
                    return safeInitialData.subjectId._id;
                  }
                  return "";
                })()
              : subjects.find((s) => s.name === preSelectedFilters.subject)
                  ?._id || "",
          examType:
            mode === "edit"
              ? safeInitialData.examType || ""
              : preSelectedFilters.examType || "",
          period: safeInitialData.period || "",
          topicId: (() => {
            if (typeof safeInitialData.topicId === "string") {
              return safeInitialData.topicId;
            } else if (safeInitialData.topicId?._id) {
              return safeInitialData.topicId._id;
            }
            return "";
          })(),
          date: safeInitialData.date
            ? new Date(safeInitialData.date).toISOString().split("T")[0]
            : "",
          duration: safeInitialData.duration?.toString() || "",
          totalQuestions: safeInitialData.totalQuestions?.toString() || "",
          rewardNuts: safeInitialData.rewardNuts?.toString() || "",
        }}
        validationRules={validationRules}
      />
    </GenericModal>
  );
};

export default ExamFormModal;
