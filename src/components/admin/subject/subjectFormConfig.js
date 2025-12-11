// Default subject form fields configuration
export const defaultSubjectFormFields = [
  {
    name: "name",
    label: "Tên môn học",
    type: "text",
    required: true,
    placeholder: "Nhập tên môn học...",
  },
  {
    name: "grade",
    label: "Lớp",
    type: "select",
    required: true,
    placeholder: "Chọn lớp",
    options: [
      { value: "1", label: "Lớp 1" },
      { value: "2", label: "Lớp 2" },
      { value: "3", label: "Lớp 3" },
      { value: "4", label: "Lớp 4" },
      { value: "5", label: "Lớp 5" },
    ],
  },
  {
    name: "tap",
    label: "Học kỳ",
    type: "select",
    required: true,
    placeholder: "Chọn học kỳ",
    options: [
      { value: "1", label: "Học kỳ 1" },
      { value: "2", label: "Học kỳ 2" },
    ],
  },
];

// Default validation rules for subjects
export const defaultSubjectValidationRules = {
  name: {
    minLength: 2,
    maxLength: 100,
    validate: (value) => {
      if (value && value.trim().length < 2) {
        return "Tên môn học phải có ít nhất 2 ký tự";
      }
    },
  },
};
