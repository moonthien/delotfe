// Exam form configuration
export const defaultExamFormFields = [
  {
    name: "grade",
    label: "Lớp",
    type: "select",
    placeholder: "Chọn lớp...",
    required: true,
    options: [
      { value: "1", label: "Lớp 1" },
      { value: "2", label: "Lớp 2" },
      { value: "3", label: "Lớp 3" },
      { value: "4", label: "Lớp 4" },
      { value: "5", label: "Lớp 5" },
    ],
  },
  {
    name: "subjectId",
    label: "Môn học",
    type: "select",
    placeholder: "Chọn môn học...",
    required: true,
    options: [], // Will be populated dynamically based on selected grade
    dependsOn: "grade", // This field depends on grade selection
  },
  {
    name: "examType",
    label: "Loại kiểm tra",
    type: "select",
    placeholder: "Chọn loại kiểm tra...",
    required: true,
    options: [
      { value: "Topic", label: "Kiểm tra chủ đề" },
      { value: "Giữa kỳ", label: "Kiểm tra giữa kỳ" },
      { value: "Cuối kỳ", label: "Kiểm tra cuối kỳ" },
    ],
  },
  {
    name: "period",
    label: "Kỳ học",
    type: "select",
    placeholder: "Chọn kỳ học...",
    required: true,
    options: [
      { value: "Học kỳ I", label: "Học kỳ I" },
      { value: "Học kỳ II", label: "Học kỳ II" },
    ],
  },
  {
    name: "description",
    label: "Mô tả bài kiểm tra",
    type: "text",
    placeholder: "Nhập mô tả bài kiểm tra...",
    required: true,
  },
  {
    name: "rewardNuts",
    label: "Phần thưởng Nuts",
    type: "number",
    placeholder: "Nhập số nuts thưởng...",
    required: false,
    min: 0,
    max: 1000,
  },
];

export const defaultExamValidationRules = {
  grade: {
    required: "Lớp là bắt buộc",
  },
  description: {
    required: "Mô tả bài kiểm tra là bắt buộc",
    minLength: {
      value: 5,
      message: "Mô tả phải có ít nhất 5 ký tự",
    },
    maxLength: {
      value: 200,
      message: "Mô tả không được quá 200 ký tự",
    },
  },
  subjectId: {
    required: "Môn học là bắt buộc",
  },
  examType: {
    required: "Loại kiểm tra là bắt buộc",
  },
  period: {
    required: "Kỳ học là bắt buộc",
  },
  date: {
    required: "Ngày thi là bắt buộc",
  },
  duration: {
    required: "Thời gian làm bài là bắt buộc",
    min: {
      value: 5,
      message: "Thời gian làm bài tối thiểu là 5 phút",
    },
    max: {
      value: 180,
      message: "Thời gian làm bài tối đa là 180 phút",
    },
  },
  totalQuestions: {
    required: "Số câu hỏi là bắt buộc",
    min: {
      value: 1,
      message: "Số câu hỏi tối thiểu là 1",
    },
    max: {
      value: 50,
      message: "Số câu hỏi tối đa là 50",
    },
  },
  rewardNuts: {
    min: {
      value: 0,
      message: "Phần thưởng Nuts phải lớn hơn hoặc bằng 0",
    },
    max: {
      value: 1000,
      message: "Phần thưởng Nuts tối đa là 1000",
    },
  },
};
