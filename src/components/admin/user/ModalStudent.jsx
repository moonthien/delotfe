import React, { useState } from "react";
import styled from "styled-components";
import { formatAvatarUrl } from "../../../utils/urlConfig";
import { deleteMyStudent } from "../../../services/apiService";

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
  max-width: 800px;
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
  margin-bottom: 20px;
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
  border-radius: 4px;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

// Students grid trong modal
const StudentsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
`;

const StudentCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid rgba(0, 212, 170, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 212, 170, 0.15);
    border-color: rgba(0, 212, 170, 0.3);
  }
`;

const StudentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 212, 170, 0.1);
`;

const StudentAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(0, 212, 170, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.2);

  &:hover {
    border-color: rgba(0, 212, 170, 0.5);
    transform: scale(1.05);
    box-shadow: 0 8px 30px rgba(0, 212, 170, 0.3);
  }
`;

const DefaultAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4aa, #01a3a4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.3);
`;

const StudentActions = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;

  ${StudentCard}:hover & {
    opacity: 1;
  }
`;

const StudentActionBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  background: ${(props) => {
    switch (props.variant) {
      case "edit":
        return "linear-gradient(135deg, #00d4aa, #01a3a4)";
      case "delete":
        return "linear-gradient(135deg, #ff6b6b, #ff5252)";
      default:
        return "linear-gradient(135deg, #48dbfb, #0abde3)";
    }
  }};
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 8px 25px
      ${(props) => {
        switch (props.variant) {
          case "edit":
            return "rgba(0, 212, 170, 0.4)";
          case "delete":
            return "rgba(255, 107, 107, 0.4)";
          default:
            return "rgba(72, 219, 251, 0.4)";
        }
      }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddStudentBtn = styled.button`
  background: linear-gradient(135deg, #00d4aa, #01a3a4);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 170, 0.4);
  }
`;

const StudentName = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
  background: linear-gradient(135deg, #00d4aa 0%, #01a3a4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StudentInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  font-size: 14px;
`;

const StudentDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(0, 212, 170, 0.05);
  border-radius: 8px;
  border-left: 4px solid rgba(0, 212, 170, 0.3);

  .label {
    color: #64748b;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    color: #1e293b;
    font-weight: 600;
    font-size: 14px;
  }
`;

const ClassBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4aa, #01a3a4);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 212, 170, 0.3);
  display: inline-block;
`;

const CoinsDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8b4513;
  font-weight: 700;
  font-size: 16px;

  &::before {
    content: "🌰";
    font-size: 18px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-style: italic;
  padding: 40px 20px;
  background: rgba(100, 116, 139, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(100, 116, 139, 0.2);

  &::before {
    content: "📚";
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }
`;

const ModalStudent = ({
  isOpen,
  onClose,
  selectedUser,
  userStudents,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDateShort = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteStudent = async (student) => {
    if (!window.confirm(`Bạn có chắc muốn xóa học sinh "${student.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const studentId = student.id || student._id;
      await deleteMyStudent(studentId);
      alert("Xóa học sinh thành công!");
      // Call parent callback to refresh data
      onDeleteStudent(student);
    } catch (error) {
      console.error("Lỗi khi xóa học sinh:", error);
      alert("Không thể xóa học sinh!");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            👥 Học sinh của {selectedUser.username || selectedUser.email}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {userStudents.length === 0 && (
          <AddStudentBtn onClick={onAddStudent}>
            ➕ Thêm học sinh mới
          </AddStudentBtn>
        )}

        {userStudents.length > 0 ? (
          <StudentsGrid>
            {userStudents.map((student) => (
              <StudentCard key={student._id}>
                <StudentActions>
                  <StudentActionBtn
                    variant="edit"
                    onClick={() => onEditStudent(student)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </StudentActionBtn>
                  <StudentActionBtn
                    variant="delete"
                    onClick={() => handleDeleteStudent(student)}
                    title="Xóa"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "⏳" : "🗑️"}
                  </StudentActionBtn>
                </StudentActions>

                <StudentHeader>
                  {student.avatar ? (
                    <StudentAvatar
                      src={formatAvatarUrl(student.avatar)}
                      alt={student.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <DefaultAvatar>
                      {student.name.charAt(0).toUpperCase()}
                    </DefaultAvatar>
                  )}
                  <StudentName>{student.name}</StudentName>
                </StudentHeader>

                <StudentInfo>
                  <StudentDetail>
                    <span className="label">🎯 Lớp học</span>
                    <ClassBadge>Lớp {student.class}</ClassBadge>
                  </StudentDetail>
                  <StudentDetail>
                    <span className="label">🎂 Ngày sinh</span>
                    <span className="value">
                      {formatDateShort(student.dateofBirth)}
                    </span>
                  </StudentDetail>
                  <StudentDetail>
                    <span className="label">🌰 Số hạt dẻ</span>
                    <CoinsDisplay>
                      {student.nuts || student.coins || 0}
                    </CoinsDisplay>
                  </StudentDetail>
                  <StudentDetail>
                    <span className="label">🏆 Huy hiệu đạt được</span>
                    <span className="value">
                      {student.badges?.length || 0} badges
                    </span>
                  </StudentDetail>
                  <StudentDetail>
                    <span className="label">📅 Ngày tạo tài khoản</span>
                    <span className="value">
                      {formatDateShort(student.createdAt)}
                    </span>
                  </StudentDetail>
                </StudentInfo>
              </StudentCard>
            ))}
          </StudentsGrid>
        ) : (
          <EmptyState>Người dùng này chưa có học sinh nào</EmptyState>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalStudent;
