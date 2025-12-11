import React from "react"; 
import styled from "styled-components";
import { Badge } from "./GenericTable";

// Styled Text component
const StyledText = styled.span`
  color: ${(props) => props.$color || "#1a1a1a"};
  font-weight: ${(props) => props.$weight || "400"};
  font-size: ${(props) => props.$size || "14px"};
`;

// Styled Link component for URLs
const StyledLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  padding: 4px 8px;
  background-color: #eff6ff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #dbeafe;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dbeafe;
    text-decoration: underline;
  }
`;

// Styled Button component for interactive elements
const StyledButton = styled.button`
  padding: 6px 12px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
  }
`;

// Format date function
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

// Users Table Configuration
export const usersTableConfig = {
  columns: [
    {
      header: "Email",
      accessor: "email",
      width: "220px",
      minWidth: "180px",
    },
    {
      header: "Username",
      accessor: "username",
      width: "130px",
      minWidth: "110px",
    },
    {
      header: "Số điện thoại",
      accessor: "phoneNumber",
      width: "130px",
      minWidth: "110px",
      render: (value) => value || "N/A",
    },
    {
      header: "Vai trò",
      accessor: "role",
      width: "90px",
      minWidth: "70px",
      render: (value) => (
        <Badge variant={value === "admin" ? "danger" : "info"}>
          {value === "admin" ? "ADMIN" : "USER"}
        </Badge>
      ),
    },
    {
      header: "Trạng thái",
      accessor: "isActive",
      width: "110px",
      minWidth: "90px",
      render: (value) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "HOẠT ĐỘNG" : "VÔ HIỆU"}
        </Badge>
      ),
    },
    {
      header: "Xác minh",
      accessor: "isVerified",
      width: "90px",
      minWidth: "70px",
      render: (value) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {value ? (
            <span
              style={{
                color: "#0f875fff",
                textShadow: "0 1px 3px rgba(16, 185, 129, 0.3)",
              }}
              title="Đã xác minh" 
            >
              ✓
            </span>
          ) : (
            <span
              style={{
                color: "#ef4444",
                textShadow: "0 1px 3px rgba(239, 68, 68, 0.3)",
              }}
              title="Chưa xác minh"
            >
              ✗
            </span>
          )}
        </div>
      ),
    },
    {
      header: "HỌC SINH",
      accessor: "students",
      width: "160px",
      minWidth: "140px",
      render: (value, row, { onViewStudents, getStudentCount }) => {
        const count = getStudentCount ? getStudentCount(row._id) : 0;
        return (
          <StyledButton
            onClick={() => onViewStudents && onViewStudents(row)}
            style={{
              backgroundColor: "#22d3ee",
              backgroundImage:
                "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              boxShadow: "0 2px 4px rgba(34, 211, 238, 0.3)",
            }}
            onMouseOver={(e) => {
              e.target.style.boxShadow = "0 4px 8px rgba(34, 211, 238, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.boxShadow = "0 2px 4px rgba(34, 211, 238, 0.3)";
            }}
            title={`Xem ${count} học sinh`}
          >
            👥 Xem học sinh ({count})
          </StyledButton>
        );
      },
    },
  ],
};

// Subjects Table Configuration
export const subjectsTableConfig = {
  columns: [
    {
      header: "Tên môn học",
      accessor: "name",
      width: "200px",
      minWidth: "150px",
    },
    {
      header: "Lớp",
      accessor: "grade",
      width: "80px",
      minWidth: "60px",
      render: (value) => (
        <span style={{ fontWeight: "600", color: "#3b82f6" }}>{value}</span>
      ),
    },
    {
      header: "Tập",
      accessor: "tap",
      width: "80px",
      minWidth: "60px",
      render: (value) => (
        <span style={{ fontWeight: "600", color: "#059669" }}>{value}</span>
      ),
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
    {
      header: "Cập nhật",
      accessor: "updatedAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
  ],
};

// Topics Table Configuration
export const topicsTableConfig = {
  columns: [
    {
      header: "Lớp",
      accessor: "subjectId.grade",
      width: "80px",
      minWidth: "60px",
      render: (value) => (
        <span style={{ fontWeight: "600", color: "#059669" }}>
          {value ? `Lớp ${value}` : "N/A"}
        </span>
      ),
    },
    {
      header: "Môn học",
      accessor: "subjectId.name",
      width: "180px",
      minWidth: "150px",
      render: (value) => (
        <span style={{ fontWeight: "600", color: "#3b82f6" }}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      header: "Chủ đề",
      accessor: "title",
      width: "250px",
      minWidth: "200px",
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
    {
      header: "Cập nhật",
      accessor: "updatedAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
  ],
};

// Cấu hình bảng cho trang Bài học (Lessons)
export const lessonsTableConfig = {
  columns: [
    {
      header: "Môn học",
      accessor: "topicId.subjectId.name",
      width: "140px",
      minWidth: "100px",
      render: (value) => <Badge variant="primary">{value}</Badge>,
    },
    {
      header: "Chủ đề",
      accessor: "topicId.title",
      width: "150px",
      minWidth: "120px",
      render: (value) => (
        <StyledText $color="#2d5a87" $weight="500">
          {value}
        </StyledText>
      ),
    },
    {
      header: "Tên bài học",
      accessor: "title",
      width: "200px",
      minWidth: "150px",
      render: (value) => (
        <StyledText $color="#1a1a1a" $weight="600">
          {value}
        </StyledText>
      ),
    },
    {
      header: "URL Video",
      accessor: "urlVideo",
      width: "200px",
      minWidth: "150px",
      render: (value) => {
        if (!value) {
          return (
            <span style={{ color: "#888", fontSize: "12px" }}>
              Chưa có video
            </span>
          );
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <StyledLink
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              🎥 Xem video
            </StyledLink>
          </div>
        );
      },
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "120px",
      minWidth: "100px",
      render: (value) => formatDate(value),
    },
    {
      header: "Cập nhật",
      accessor: "updatedAt",
      width: "120px",
      minWidth: "100px",
      render: (value) => formatDate(value),
    },
  ],
};

// Tests/Question Sets Table Configuration
export const testsTableConfig = {
  columns: [
    {
      header: "Khối",
      accessor: "refId.subjectId.grade",
      width: "80px",
      minWidth: "60px",
      render: (value) => <Badge variant="info">Khối {value}</Badge>,
    },
    {
      header: "Môn học",
      accessor: "refId.subjectId.name",
      width: "140px",
      minWidth: "120px",
      render: (value) => <Badge variant="primary">{value || "N/A"}</Badge>,
    },
    {
      header: "Loại kiểm tra",
      accessor: "refId.examType",
      width: "140px",
      minWidth: "120px",
      render: (value) => (
        <Badge
          variant={
            value === "giữa kỳ"
              ? "warning"
              : value === "cuối kỳ"
              ? "danger"
              : "info"
          }
        >
          {value || "N/A"}
        </Badge>
      ),
    },
    {
      header: "Mô tả",
      accessor: "refId.description",
      width: "230px",
      minWidth: "200px",
      render: (value) => (
        <StyledText $color="#1a1a1a" $weight="400">
          {value || "Không có mô tả"}
        </StyledText>
      ),
    },
    {
      header: "Hạt dẻ thưởng",
      accessor: "refId.rewardNuts",
      width: "120px",
      minWidth: "100px",
      render: (value) => (
        <StyledText $color="#059669" $weight="500">
          {value || "0"}
        </StyledText>
      ),
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "120px",
      minWidth: "100px",
      render: (value) => formatDate(value),
    },
    // {
    //   header: "Cập nhật",
    //   accessor: "updatedAt",
    //   width: "120px",
    //   minWidth: "100px",
    //   render: (value) => formatDate(value),
    // },
  ],
};

// Ontap Table Configuration - specialized for lesson question management
export const ontapTableConfig = {
  columns: [
    {
      header: "Môn học",
      accessor: "refId.topicId.subjectId.name",
      width: "140px",
      minWidth: "120px",
      render: (value) => <Badge variant="primary">{value || "N/A"}</Badge>,
    },
    {
      header: "Chủ đề",
      accessor: "refId.topicId.title",
      width: "200px",
      minWidth: "150px",
      render: (value) => (
        <StyledText $color="#2d5a87" $weight="500">
          {value || "N/A"}
        </StyledText>
      ),
    },
    {
      header: "Bài học",
      accessor: "refId.title",
      width: "250px",
      minWidth: "200px",
      render: (value) => (
        <StyledText $color="#1a1a1a" $weight="600">
          {value || "N/A"}
        </StyledText>
      ),
    },
    {
      header: "Số câu hỏi",
      accessor: "questionSets",
      width: "120px",
      minWidth: "100px",
      render: (value) => {
        const totalQuestions =
          value?.reduce(
            (total, set) => total + (set.questions?.length || 0),
            0
          ) || 0;
        return (
          <Badge variant={totalQuestions > 0 ? "success" : "danger"}>
            {totalQuestions} câu hỏi
          </Badge>
        );
      },
    },
    {
      header: "Mức độ",
      accessor: "questionSets",
      width: "180px",
      minWidth: "150px",
      render: (value) => {
        if (!value || value.length === 0) {
          return (
            <span style={{ color: "#888", fontSize: "12px" }}>
              Chưa có câu hỏi
            </span>
          );
        }

        const levels = value.map((set) => {
          const levelText =
            set.level === "de"
              ? "Dễ"
              : set.level === "trungbinh"
              ? "TB"
              : set.level === "nangcao"
              ? "NC"
              : set.level;
          const questionCount = set.questions?.length || 0;
          return `${levelText}(${questionCount})`;
        });

        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {levels.map((level, index) => (
              <span
                key={index}
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "500",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #e2e8f0",
                }}
              >
                {level}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "120px",
      minWidth: "100px",
      render: (value) => formatDate(value),
    },
  ],
};

// Questions Table Configuration
export const questionsTableConfig = {
  columns: [
    {
      header: "STT",
      accessor: "rowIndex",
      width: "60px",
      minWidth: "60px",
      render: (value) => (
        <Badge variant="info">{(value !== undefined ? value : 0) + 1}</Badge>
      ),
    },
    {
      header: "Câu hỏi",
      accessor: "questionText",
      width: "255px",
      minWidth: "200px",
      render: (value) => (
        <StyledText $color="#1a1a1a" $weight="500">
          {value || "Không có câu hỏi"}
        </StyledText>
      ),
    },
    {
      header: "Đáp án",
      accessor: "options",
      width: "200px",
      minWidth: "200px",
      render: (value, row) => {
        // Nếu có options (câu hỏi trắc nghiệm)
        if (value && typeof value === "object") {
          const optionKeys = Object.keys(value);
          const correctAnswer = row.correctAnswer;

          return (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {optionKeys.map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    background: key === correctAnswer ? "#dcfce7" : "#f8fafc",
                    color: key === correctAnswer ? "#166534" : "#374151",
                    fontWeight: key === correctAnswer ? "600" : "400",
                    border:
                      key === correctAnswer
                        ? "1px solid #bbf7d0"
                        : "1px solid #e2e8f0",
                  }}
                >
                  {key}. {value[key]}
                  {key === correctAnswer && " ✓"}
                </div>
              ))}
            </div>
          );
        }

        // Nếu không có options (câu hỏi tự luận)
        return (
          <div
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              background: "#dcfce7",
              color: "#166534",
              fontWeight: "600",
              border: "1px solid #bbf7d0",
              display: "inline-block",
            }}
          >
            Đáp án: {row?.correctAnswer || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Giải thích",
      accessor: "explanation",
      width: "230px",
      minWidth: "200px",
      render: (value) => (
        <StyledText
          $color="#64748b"
          $weight="400"
          style={{
            maxWidth: "280px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
          title={value || "Không có giải thích"}
        >
          {value
            ? value.length > 50
              ? `${value.substring(0, 50)}...`
              : value
            : "Không có giải thích"}
        </StyledText>
      ),
    },
    {
      header: "Hình ảnh",
      accessor: "image",
      width: "120px",
      minWidth: "100px",
      render: (value) => {
        if (!value) {
          return (
            <span style={{ color: "#888", fontSize: "12px" }}>Không có</span>
          );
        }

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <StyledLink href={value} target="_blank" rel="noopener noreferrer">
              🖼️ Xem ảnh
            </StyledLink>
          </div>
        );
      },
    },
    {
      header: "Loại câu hỏi",
      accessor: "options",
      width: "120px",
      minWidth: "100px",
      render: (value) => (
        <Badge variant={value ? "primary" : "info"}>
          {value ? "Trắc nghiệm" : "Tự luận"}
        </Badge>
      ),
    },
    {
      header: "Câu đọc hiểu",
      accessor: "isReadingQuestion",
      width: "90px",
      minWidth: "80px",
      render: (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Đọc hiểu" : "Thường"}
        </Badge>
      ),
    },
  ],
};

// Badges Table Configuration
export const badgesTableConfig = {
  columns: [
    {
      header: "Tên huy hiệu",
      accessor: "title",
      width: "200px",
      minWidth: "150px",
      render: (value) => (
        <StyledText $color="#1a1a1a" $weight="600">
          {value || "Không có tên"}
        </StyledText>
      ),
    },
    {
      header: "Mô tả",
      accessor: "description",
      width: "250px",
      minWidth: "200px",
      render: (value) => (
        <StyledText $color="#64748b" $weight="400">
          {value || "Không có mô tả"}
        </StyledText>
      ),
    },
    {
      header: "Danh mục",
      accessor: "category",
      width: "120px",
      minWidth: "100px",
      render: (value) => {
        const categoryLabels = {
          chuyencan: "Chuyên cần",
          soluong: "Số lượng",
          dacbiet: "Đặc biệt",
        };
        const categoryColors = {
          chuyencan: "success",
          soluong: "info",
          dacbiet: "warning",
        };
        return (
          <Badge variant={categoryColors[value] || "info"}>
            {categoryLabels[value] || value || "N/A"}
          </Badge>
        );
      },
    },
    {
      header: "Điều kiện",
      accessor: "condition",
      width: "200px",
      minWidth: "150px",
      render: (value) => {
        if (!value)
          return (
            <span style={{ color: "#888", fontSize: "12px" }}>
              Không có điều kiện
            </span>
          );

        const typeLabels = {
          days_in_row: "Ngày liên tiếp",
          exercises_done: "Bài tập hoàn thành",
          score: "Điểm số",
          speed: "Tốc độ",
        };

        const subjectLabels = {
          any: "Tất cả môn",
          toan: "Toán",
          tiengviet: "Tiếng Việt",
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <StyledText $color="#374151" $weight="500" $size="12px">
              {typeLabels[value.type] || value.type}: {value.value}
            </StyledText>
            <StyledText $color="#64748b" $weight="400" $size="11px">
              Môn: {subjectLabels[value.subject] || value.subject}
            </StyledText>
          </div>
        );
      },
    },
    {
      header: "Hạt dẻ thưởng",
      accessor: "rewardNuts",
      width: "120px",
      minWidth: "100px",
      render: (value) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🌰</span>
          <StyledText $color="#059669" $weight="600" $size="14px">
            {value || "0"}
          </StyledText>
        </div>
      ),
    },
    {
      header: "Icon",
      accessor: "icon",
      width: "80px",
      minWidth: "60px",
      render: (value) => (
        <div style={{ fontSize: "24px", textAlign: "center" }}>
          {value ? (
            value.startsWith("http") || value.startsWith("/") ? (
              <img
                src={value}
                alt="icon"
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "contain",
                  borderRadius: "6px",
                }}
              />
            ) : (
              value
            )
          ) : (
            "🏆"
          )}
        </div>
      ),
    },
    {
      header: "Ngày tạo",
      accessor: "createdAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
    {
      header: "Cập nhật",
      accessor: "updatedAt",
      width: "150px",
      minWidth: "120px",
      render: (value) => formatDate(value),
    },
  ],
};
