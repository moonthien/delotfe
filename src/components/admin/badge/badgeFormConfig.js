// Badge form configuration
export const defaultBadgeFormFields = [
  {
    name: "title",
    label: "Tên huy hiệu",
    type: "text",
    placeholder: "Nhập tên huy hiệu...",
    required: true,
  },
  {
    name: "description",
    label: "Mô tả",
    type: "textarea",
    placeholder: "Nhập mô tả huy hiệu...",
    required: true,
    rows: 4,
  },
  {
    name: "icon",
    label: "Icon huy hiệu",
    type: "select",
    placeholder: "Chọn icon...",
    required: true,
    options: [
      { value: "🏆", label: "🏆 Cúp vàng" },
      { value: "🥇", label: "🥇 Huy chương vàng" },
      { value: "🥈", label: "🥈 Huy chương bạc" },
      { value: "🥉", label: "🥉 Huy chương đồng" },
      { value: "⭐", label: "⭐ Ngôi sao" },
      { value: "🌟", label: "🌟 Ngôi sao sáng" },
      { value: "💎", label: "💎 Kim cương" },
      { value: "👑", label: "👑 Vương miện" },
      { value: "🎖️", label: "🎖️ Huy chương quân sự" },
      { value: "🏅", label: "🏅 Huy chương thể thao" },
    ],
  },
  {
    name: "category",
    label: "Danh mục",
    type: "select",
    placeholder: "Chọn danh mục...",
    required: true,
    options: [
      { value: "chuyencan", label: "Chuyên cần" },
      { value: "soluong", label: "Số lượng" },
      { value: "dacbiet", label: "Đặc biệt" },
    ],
  },
  {
    name: "rewardNuts",
    label: "Hạt dẻ thưởng",
    type: "number",
    placeholder: "Nhập số hạt dẻ thưởng...",
    required: true,
    min: 0,
  },
  {
    name: "condition.type",
    label: "Loại điều kiện",
    type: "select",
    placeholder: "Chọn loại điều kiện...",
    required: true,
    options: [
      { value: "days_in_row", label: "Số ngày liên tiếp" },
      { value: "exercises_done", label: "Số bài tập hoàn thành" },
      { value: "score", label: "Điểm số" },
      { value: "speed", label: "Tốc độ" },
    ],
  },
  {
    name: "condition.value",
    label: "Giá trị điều kiện",
    type: "number",
    placeholder: "Nhập giá trị...",
    required: true,
    min: 1,
  },
  {
    name: "condition.subject",
    label: "Môn học áp dụng",
    type: "select",
    placeholder: "Chọn môn học...",
    required: true,
    options: [
      { value: "any", label: "Tất cả môn học" },
      { value: "toan", label: "Toán" },
      { value: "tiengviet", label: "Tiếng Việt" },
    ],
  },
];

export const defaultBadgeValidationRules = {
  title: {
    required: "Tên huy hiệu là bắt buộc",
    minLength: {
      value: 2,
      message: "Tên huy hiệu phải có ít nhất 2 ký tự",
    },
    maxLength: {
      value: 100,
      message: "Tên huy hiệu không được quá 100 ký tự",
    },
  },
  description: {
    required: "Mô tả là bắt buộc",
    minLength: {
      value: 10,
      message: "Mô tả phải có ít nhất 10 ký tự",
    },
    maxLength: {
      value: 500,
      message: "Mô tả không được quá 500 ký tự",
    },
  },
  icon: {
    required: "Icon là bắt buộc",
  },
  category: {
    required: "Danh mục là bắt buộc",
  },
  rewardNuts: {
    required: "Hạt dẻ thưởng là bắt buộc",
    min: {
      value: 0,
      message: "Hạt dẻ thưởng không được âm",
    },
    max: {
      value: 1000,
      message: "Hạt dẻ thưởng không được quá 1000",
    },
  },
  "condition.type": {
    required: "Loại điều kiện là bắt buộc",
  },
  "condition.value": {
    required: "Giá trị điều kiện là bắt buộc",
    min: {
      value: 1,
      message: "Giá trị điều kiện phải lớn hơn 0",
    },
    max: {
      value: 10000,
      message: "Giá trị điều kiện không được quá 10000",
    },
  },
  "condition.subject": {
    required: "Môn học áp dụng là bắt buộc",
  },
};
