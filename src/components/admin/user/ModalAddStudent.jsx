import React, { useState, useRef } from "react";
import styled from "styled-components";
import { uploadImageStudent } from "../../../services/apiService";
import { formatImageUrl } from "../../../utils/urlConfig";
import API_CONFIG from "../../../utils/urlConfig";

// Modal overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

// Modal content
const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Modal header
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 50%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #e11d48;
  }
`;

// Form styles
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #00a3ff;
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00a3ff;
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

// File upload styles
const FileUploadContainer = styled.div`
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #00a3ff;
    background: #f8faff;
  }

  &.dragover {
    border-color: #00a3ff;
    background: #f0f8ff;
  }
`;

const FileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const FileUploadText = styled.div`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 8px;

  .highlight {
    color: #00a3ff;
    font-weight: 600;
  }
`;

const FileUploadHint = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

const ImagePreview = styled.div`
  margin-top: 12px;
  position: relative;
  display: inline-block;
`;

const PreviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #dc2626;
  }
`;

const UploadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  gap: 8px;
  color: #00a3ff;
  font-size: 14px;
  font-weight: 600;
`;

// Button styles
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 163, 255, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 163, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Styled components for file input and preview
const HiddenFileInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const AvatarPreviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  margin-top: 12px;
`;

const ModalAddStudent = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  selectedUserId,
}) => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    dateofBirth: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAvatarPath, setUploadedAvatarPath] = useState("");

  // Class options from 1 to 12
  const classOptions = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // File upload handlers
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Vui lòng chọn file ảnh (JPG, PNG, GIF, etc.)",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Kích thước file không được vượt quá 5MB",
      }));
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await uploadImageStudent(formData);
      const uploadedImagePath = response.data.url || response.data.data?.url; // Đường dẫn ảnh sau khi upload
      setUploadedAvatarPath(uploadedImagePath); // Cập nhật state với đường dẫn ảnh mới

      // Clear any previous avatar errors
      if (errors.avatar) {
        setErrors((prev) => ({
          ...prev,
          avatar: "",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        avatar: "Không thể tải ảnh!",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedAvatarPath("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên học sinh là bắt buộc";
    }

    if (!formData.class) {
      newErrors.class = "Lớp học là bắt buộc";
    }

    if (!formData.dateofBirth) {
      newErrors.dateofBirth = "Ngày sinh là bắt buộc";
    } else {
      // Validate date format and age
      const birthDate = new Date(formData.dateofBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 5 || age > 20) {
        newErrors.dateofBirth = "Tuổi học sinh phải từ 5 đến 20";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Sử dụng ảnh đã upload hoặc ảnh mặc định
      const avatarUrl = uploadedAvatarPath
        ? formatImageUrl(uploadedAvatarPath)
        : API_CONFIG.DEFAULT_AVATAR;

      const studentData = {
        userId: selectedUserId,
        name: formData.name.trim(),
        class: formData.class,
        dateofBirth: formData.dateofBirth,
        avatar: avatarUrl,
      };
      await onSubmit(studentData);
      handleClose();
    } catch (error) {
      // Show specific error message
      const errorMessage = error.message || "Có lỗi xảy ra khi thêm học sinh";
      setErrors((prev) => ({
        ...prev,
        avatar: errorMessage,
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      class: "",
      dateofBirth: "",
      avatar: "",
    });
    setErrors({});
    setUploadedAvatarPath("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <span>👶</span>
            Thêm học sinh mới
          </ModalTitle>
          <CloseButton onClick={handleClose} type="button">
            ✕
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">
              Tên học sinh <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên học sinh..."
              disabled={isLoading}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="class">
              Lớp học <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            <Select
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="">Chọn lớp học</option>
              {classOptions.map((classNum) => (
                <option key={classNum} value={classNum.toString()}>
                  Lớp {classNum}
                </option>
              ))}
            </Select>
            {errors.class && <ErrorMessage>{errors.class}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dateofBirth">
              Ngày sinh <span style={{ color: "#ef4444" }}>*</span>
            </Label>
            <Input
              type="date"
              id="dateofBirth"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            {errors.dateofBirth && (
              <ErrorMessage>{errors.dateofBirth}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="avatar">Ảnh đại diện (tùy chọn)</Label>
            <div style={{ position: "relative" }}>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />

              {isUploading && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "8px",
                    background: "#f8fafc",
                  }}
                >
                  <LoadingSpinner />
                  <div style={{ marginTop: "8px", color: "#64748b" }}>
                    Đang upload...
                  </div>
                </div>
              )}

              {!isUploading && !uploadedAvatarPath && (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: "#f8fafc",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={{ color: "#00a3ff", fontWeight: "600" }}>
                    Click để chọn ảnh
                  </div>
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                  </div>
                </div>
              )}

              {uploadedAvatarPath && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <AvatarPreviewImage
                      src={
                        formatImageUrl(uploadedAvatarPath) ||
                        API_CONFIG.DEFAULT_AVATAR
                      }
                      onError={(e) => {
                        e.target.src = API_CONFIG.DEFAULT_AVATAR;
                      }}
                      alt="Avatar Preview"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        color: "white",
                        border: "2px solid white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        zIndex: 10,
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#dc2626";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#ef4444";
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#10b981",
                      fontWeight: "600",
                    }}
                  >
                    ✅ Upload thành công
                  </div>
                </div>
              )}
            </div>
            {errors.avatar && <ErrorMessage>{errors.avatar}</ErrorMessage>}
          </FormGroup>

          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={isLoading || isUploading}
            >
              Hủy
            </CancelButton>
            <SubmitButton type="submit" disabled={isLoading || isUploading}>
              {isLoading || isUploading ? (
                <>
                  <LoadingSpinner />
                  {isUploading ? "Đang upload..." : "Đang thêm..."}
                </>
              ) : (
                <>
                  <span>✅</span>
                  Thêm học sinh
                </>
              )}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalAddStudent;
