import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaLock, FaPlus } from "react-icons/fa";
import useStudent from "../hooks/useStudent";

const ManageProfiles = () => {
  const { students, createStudent } = useStudent();
  const [showForm, setShowForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "", class: "", dateofBirth: "", avatar: null
  });
  const [errors, setErrors] = useState({});

  // Hàm format tên: Nguyễn Văn An
  const formatName = (input) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Gộp nhiều khoảng trắng thành 1
      .split(' ')
      .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
      .join(' ');
  };

  // Validate tên
  const validateName = (name) => {
    const formatted = formatName(name);
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; // Chỉ chữ cái và khoảng trắng (có dấu tiếng Việt)
    const words = formatted.split(' ').filter(w => w);

    if (!name.trim()) return "Vui lòng nhập tên học sinh";
    if (!nameRegex.test(name)) return "Tên không được chứa số hoặc ký tự đặc biệt";
    if (words.length < 2) return "Vui lòng nhập đầy đủ họ và tên";
    if (formatted !== name.trim() && name.trim() !== "") {
      // Tự động sửa nếu người dùng gõ sai
      setTimeout(() => {
        setNewStudent(prev => ({ ...prev, name: formatted }));
      }, 0);
    }
    return "";
  };

  // Validate ngày sinh
  const validateDate = (date) => {
    if (!date) return "Vui lòng chọn ngày sinh";
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected >= today) return "Ngày sinh phải nhỏ hơn ngày hiện tại";
    return "";
  };

  // Kiểm tra toàn bộ form
  const validateForm = () => {
    const nameError = validateName(newStudent.name);
    const dateError = validateDate(newStudent.dateofBirth);

    setErrors({
      name: nameError,
      dateofBirth: dateError
    });

    return !nameError && !dateError;
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createStudent(newStudent);
      setShowForm(false);
      setNewStudent({ name: "", class: "", dateofBirth: "", avatar: null });
      setErrors({});
    } catch (err) {
      alert(err.message || "Đã có lỗi xảy ra");
    }
  };

  const handleSelectProfile = (profile) => {
    localStorage.setItem("studentId", profile._id);
    localStorage.setItem("selectedStudent", JSON.stringify({
      id: profile._id,
      name: profile.name,
      class: profile.class,
      avatar: profile.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }));
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/dang-nhap";
  };

  // Tự động tính lớp khi thay đổi ngày sinh
  useEffect(() => {
    if (newStudent.dateofBirth) {
      const birthYear = new Date(newStudent.dateofBirth).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      let autoClass = age - 5;
      if (autoClass < 1) autoClass = 1;
      if (autoClass > 12) autoClass = 12;
      setNewStudent(prev => ({ ...prev, class: autoClass }));
    }
  }, [newStudent.dateofBirth]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Thông tin học sinh</Title>
        
        <ProfileList>
          {students.length > 0 ? (
            students.map((profile) => (
              <ProfileItem key={profile._id} onClick={() => handleSelectProfile(profile)}>
                <Avatar
                  src={
                    profile.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt={profile.name}
                />
                <Name>{profile.name}</Name>
                {profile.locked && (
                  <LockIcon>
                    <FaLock />
                  </LockIcon>
                )}
              </ProfileItem>
            ))
          ) : (
            <ProfileItem onClick={() => setShowForm(true)}>
              <AddAvatar>
                <FaPlus />
              </AddAvatar>
            </ProfileItem>
          )}
        </ProfileList>

        {/* Form thêm học sinh - ĐÃ VALIDATE */}
        {showForm && students.length === 0 && (
          <FormOverlay onClick={() => setShowForm(false)}>
            <FormWrapper onClick={(e) => e.stopPropagation()}>
              <FormHeader>
                <h2>Thêm hồ sơ học sinh</h2>
                <CloseButton onClick={() => {
                  setShowForm(false);
                  setErrors({});
                  setNewStudent({ name: "", class: "", dateofBirth: "", avatar: null });
                }}>×</CloseButton>
              </FormHeader>

              <StyledForm onSubmit={handleAddStudent}>
                <InputGroup>
                  <Label>Tên học sinh *</Label>
                  <Input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={newStudent.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewStudent({ ...newStudent, name: value });
                      const error = validateName(value);
                      setErrors(prev => ({ ...prev, name: error }));
                    }}
                    $error={!!errors.name}
                  />
                  {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </InputGroup>

                <InputGroup>
                  <Label>Ngày sinh *</Label>
                  <Input
                    type="date"
                    value={newStudent.dateofBirth}
                    max={new Date().toISOString().split("T")[0]} // Không chọn ngày tương lai
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewStudent({ ...newStudent, dateofBirth: value });
                      const error = validateDate(value);
                      setErrors(prev => ({ ...prev, dateofBirth: error }));
                    }}
                    $error={!!errors.dateofBirth}
                  />
                  {errors.dateofBirth && <ErrorText>{errors.dateofBirth}</ErrorText>}
                </InputGroup>

                <InputGroup>
                  <Label>Lớp (tự động)</Label>
                  <Input
                    type="text"
                    value={newStudent.class ? `Lớp ${newStudent.class}` : "Chưa xác định"}
                    readOnly
                    disabled
                    $readonly
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Ảnh đại diện (không bắt buộc)</Label>
                  <FileInputLabel htmlFor="avatar-upload">
                    {newStudent.avatar ? (
                      <PreviewWrapper>
                        <PreviewImage
                          src={URL.createObjectURL(newStudent.avatar)}
                          alt="Preview"
                        />
                        <FileName>{newStudent.avatar.name}</FileName>
                      </PreviewWrapper>
                    ) : (
                      <>
                        <FaPlus style={{ marginRight: '8px' }} />
                        Chọn ảnh
                      </>
                    )}
                  </FileInputLabel>
                  <HiddenFileInput
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNewStudent({ ...newStudent, avatar: e.target.files[0] });
                      }
                    }}
                  />
                </InputGroup>

                <ButtonGroup>
                  <CancelButton type="button" onClick={() => {
                    setShowForm(false);
                    setErrors({});
                    setNewStudent({ name: "", class: "", dateofBirth: "", avatar: null });
                  }}>
                    Hủy
                  </CancelButton>
                  <SubmitButton 
                    type="submit" 
                    disabled={!!errors.name || !!errors.dateofBirth || !newStudent.name || !newStudent.dateofBirth}
                  >
                    Thêm học sinh
                  </SubmitButton>
                </ButtonGroup>
              </StyledForm>
            </FormWrapper>
          </FormOverlay>
        )}
        
        <ButtonLogout onClick={handleLogout}>Đăng xuất</ButtonLogout>
      </Container>
    </>
  );
};

export default ManageProfiles;

// ================================
// STYLED COMPONENTS
// ================================

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

const Container = styled.div`
  background-color: #141414;
  color: white;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 50px;
  font-weight: 700;
`;

const ProfileList = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #222;
  border: 3px solid transparent;
  transition: border 0.2s;

  ${ProfileItem}:hover & {
    border-color: #10b981;
  }
`;

const Name = styled.div`
  margin-top: 12px;
  font-size: 1.25rem;
  font-weight: 500;
`;

const LockIcon = styled.div`
  margin-top: 6px;
  font-size: 1.1rem;
  color: #888;
`;

const ButtonLogout = styled.button`
  margin-top: 60px;
  padding: 12px 28px;
  background: none;
  border: 1px solid #555;
  color: white;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    border-color: #10b981;
  }
`;

const AddAvatar = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 8px;
  background-color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #666;
  transition: all 0.3s;
  border: 2px dashed #444;

  &:hover {
    background-color: #2a2a2a;
    color: white;
    border-color: #10b981;
  }
`;

// === FORM STYLES ===
const FormOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const FormWrapper = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  border: 1px solid #333;
  animation: slideUp 0.4s ease-out;

  @media (max-width: 480px) {
    margin: 20px;
    padding: 24px;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.8rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: white;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #ccc;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 14px;
  background: #333;
  border: 1px solid ${({ $error }) => $error ? '#e11d48' : '#444'};
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: ${({ $error }) => $error ? '#e11d48' : '#10b981'};
    box-shadow: 0 0 0 3px ${({ $error }) => $error ? 'rgba(225, 29, 72, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  }

  ${({ $readonly }) =>
    $readonly &&
    `
    background: #222;
    color: #aaa;
    cursor: not-allowed;
    border-color: #333;
  `}
`;

const ErrorText = styled.small`
  color: #fca5a5;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #333;
  border: 1px dashed #555;
  border-radius: 8px;
  color: #aaa;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;

  &:hover {
    border-color: #10b981;
    background: #0a2e1f;
    color: white;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const PreviewImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #555;
`;

const FileName = styled.span`
  font-size: 0.85rem;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #333;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #444;
    color: white;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;