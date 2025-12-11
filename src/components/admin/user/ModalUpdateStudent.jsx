import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import {
  updateMyStudent,
  uploadImageStudent,
} from "../../../services/apiService";
import { formatImageUrl } from "../../../utils/urlConfig";

// Modal overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  bac              placeholder="Nhập tên học sinh"
              disabled={isUpdating}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Lớp *</Label>
            <Select
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              disabled={isUpdating}
            />0, 0, 0, 0.5);
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
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00a3ff;
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00a3ff;
    box-shadow: 0 0 0 3px rgba(0, 163, 255, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
`;

// File input and preview styles
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

const UpdateButton = styled(Button)`
  background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 163, 255, 0.4);
  }
`;

const ModalUpdateStudent = ({ isOpen, onClose, onUpdate, student }) => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    dateofBirth: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadedAvatarPath, setUploadedAvatarPath] = useState("");
  const fileInputRef = useRef(null);

  const classOptions = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);

  // Fill form with student data when student changes
  useEffect(() => {
    if (student) {
      console.log("Student data received:", student); // Debug log
      console.log(
        "Student class value:",
        student.class,
        "Type:",
        typeof student.class
      ); // Debug class

      // Format date properly for input[type="date"]
      let formattedDate = "";
      if (student.dateofBirth) {
        const date = new Date(student.dateofBirth);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      // Format class - ensure it matches our options
      let formattedClass = "";
      if (student.class) {
        console.log("Formatting class:", student.class); // Debug
        const classStr = student.class.toString().trim();
        // If class is just a number, format it as "Lớp X"
        if (/^\d+$/.test(classStr)) {
          formattedClass = `Lớp ${classStr}`;
          console.log("Formatted as number:", formattedClass); // Debug
        } else if (classStr.toLowerCase().startsWith("lớp")) {
          formattedClass = classStr;
          console.log("Already formatted:", formattedClass); // Debug
        } else {
          formattedClass = `Lớp ${classStr}`;
          console.log("Default format:", formattedClass); // Debug
        }
      } else {
        console.log("Student class is empty/null/undefined"); // Debug
      }

      console.log("Final formatted class:", formattedClass); // Debug

      setFormData({
        name: student.name || "",
        class: formattedClass || "",
        dateofBirth: formattedDate || "",
        avatar: student.avatar || "",
      });
      setUploadedAvatarPath(student.avatar || "");
    }
  }, [student]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File không được vượt quá 5MB!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await uploadImageStudent(formData);
      const uploadedImagePath = response.data.url || response.data.data?.url;
      setUploadedAvatarPath(uploadedImagePath);
      toast.success("Ảnh đã được tải lên thành công!");
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      toast.error("Không thể tải ảnh!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên không được để trống";
    if (!formData.class) newErrors.class = "Vui lòng chọn lớp";
    if (!formData.dateofBirth)
      newErrors.dateofBirth = "Vui lòng chọn ngày sinh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      // Format class back to number if needed (remove "Lớp " prefix)
      let classValue = formData.class;
      if (classValue.startsWith("Lớp ")) {
        classValue = classValue.replace("Lớp ", "");
      }

      const updateData = {
        name: formData.name.trim(),
        class: classValue,
        dateofBirth: formData.dateofBirth,
        avatar: uploadedAvatarPath || formData.avatar,
      };

      console.log("Sending update data:", updateData); // Debug log
      console.log("Student ID:", student.id || student._id); // Debug log

      const studentId = student.id || student._id;
      await updateMyStudent(studentId, updateData);

      // Tạo object student đã cập nhật để truyền về parent
      const updatedStudent = {
        ...student,
        ...updateData,
        id: studentId,
        _id: studentId,
      };

      toast.success("Cập nhật học sinh thành công!");
      onUpdate(updatedStudent); // Truyền data đã cập nhật về parent
      handleClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật học sinh:", error);
      toast.error("Không thể cập nhật học sinh!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", class: "", dateofBirth: "", avatar: "" });
    setErrors({});
    setUploadedAvatarPath("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>✏️ Cập nhật học sinh</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleUpdate}>
          <FormGroup>
            <Label>Tên học sinh *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên học sinh"
              disabled={isUpdating}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Lớp *</Label>
            <Select
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              disabled={isUpdating}
            >
              <option value="">Chọn lớp</option>
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors.class && <ErrorMessage>{errors.class}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Ngày sinh *</Label>
            <Input
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleInputChange}
              disabled={isUpdating}
            />
            {errors.dateofBirth && (
              <ErrorMessage>{errors.dateofBirth}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Ảnh đại diện</Label>
            <div style={{ position: "relative" }}>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || isUpdating}
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
                  Đang upload...
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
                    Click để chọn ảnh mới
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
                      src={formatImageUrl(uploadedAvatarPath)}
                      alt="Avatar Preview"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedAvatarPath("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
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
                      disabled={isUpdating}
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
                    ✅ Ảnh hiện tại
                  </div>
                </div>
              )}
            </div>
          </FormGroup>

          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={isUpdating || isUploading}
            >
              Hủy
            </CancelButton>
            <UpdateButton type="submit" disabled={isUpdating || isUploading}>
              {isUpdating ? "Đang cập nhật..." : "💾 Cập nhật"}
            </UpdateButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalUpdateStudent;
