// Default user form fields configuration
export const defaultUserFormFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "Nhập email...",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    placeholder: "Nhập username...",
  },
  {
    name: "phoneNumber",
    label: "Số điện thoại",
    type: "tel",
    required: false,
    placeholder: "Nhập số điện thoại...",
  },
  {
    name: "password",
    label: "Mật khẩu",
    type: "password",
    required: true,
    placeholder: "Nhập mật khẩu...",
  },
  {
    name: "role",
    label: "Vai trò",
    type: "select",
    required: true,
    defaultValue: "user",
    options: [
      { value: "user", label: "Người dùng" },
      { value: "admin", label: "Quản trị viên" },
    ],
  },
];

// Default validation rules
export const defaultUserValidationRules = {
  password: {
    minLength: 6,
  },
  email: {
    validate: (value) => {
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        return "Email không hợp lệ";
      }
    },
  },
  phoneNumber: {
    validate: (value) => {
      if (value && !/^[0-9+\-\s()]+$/.test(value)) {
        return "Số điện thoại không hợp lệ";
      }
    },
  },
};

// Edit mode fields (without password)
export const editUserFormFields = defaultUserFormFields.filter(
  (field) => field.name !== "password"
);
