// Lesson form configuration
export const defaultLessonFormFields = [
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
  },
  {
    name: "topicId",
    label: "Chủ đề",
    type: "select",
    placeholder: "Chọn chủ đề...",
    required: true,
    options: [], // Will be populated dynamically based on selected subject
  },
  {
    name: "title",
    label: "Tên bài học",
    type: "text",
    placeholder: "Nhập tên bài học...",
    required: true,
  },
  {
    name: "urlVideo",
    label: "URL Video",
    type: "url",
    placeholder: "Nhập URL video (YouTube, Vimeo, etc.)...",
    required: false,
  },
];

export const defaultLessonValidationRules = {
  grade: {
    required: "Lớp là bắt buộc",
  },
  subjectId: {
    required: "Môn học là bắt buộc",
  },
  topicId: {
    required: "Chủ đề là bắt buộc",
  },
  title: {
    required: "Tên bài học là bắt buộc",
    minLength: {
      value: 2,
      message: "Tên bài học phải có ít nhất 2 ký tự",
    },
    maxLength: {
      value: 100,
      message: "Tên bài học không được quá 100 ký tự",
    },
  },
  urlVideo: {
    pattern: {
      value:
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?.*v=[\w-]+.*|youtu\.be\/[\w-]+.*|vimeo\.com\/\d+.*|dailymotion\.com\/video\/[\w-]+.*|facebook\.com\/.*\/videos\/.*|drive\.google\.com\/file\/d\/[\w-]+.*|.*\.(mp4|mov|avi|wmv|flv|webm|mkv)(\?.*)?$)/i,
      message:
        "URL video không hợp lệ. Hỗ trợ YouTube, Vimeo, Facebook, Google Drive hoặc file video trực tiếp",
    },
  },
};
