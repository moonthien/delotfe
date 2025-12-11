import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  getQuestionSetsByLesson,
  getAllQuestionSetsByLesson,
  getAllTopics,
  importQuestionsViaExcel,
  deleteQuestionById,
  deleteAllQuestionsInSet,
  exportQuestionsToExcel,
} from "../../services/apiService";
import GenericTable from "../../components/admin/GenericTable";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import ImportErrorModal from "../../components/admin/ImportErrorModal";
import {
  ontapTableConfig,
  questionsTableConfig,
} from "../../components/admin/tableConfigs";

// Constants
const INITIAL_ITEMS_PER_PAGE = 10;
const SCROLL_DELAY = 100;

// Helper function for parsing question sets response (still needed for handleViewQuestions)
const parseQuestionSetsResponse = (response) => {
  return response?.data?.data || response?.data || [];
};

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { 
    width: 100%; 
    height: 100%; 
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Montserrat', sans-serif; 
  }
  #root { 
    width: 100%; 
    min-height: 100vh;
    overflow: visible;
  }
`;

const Wrapper = styled.div`
  overflow: visible;
  margin: 24px 2%;
  padding-bottom: 40px;
  min-height: calc(100vh - 80px);
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    font-size: 36px;
    color: #3b82f6;
  }

  .text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    font-size: 24px;
    .icon {
      font-size: 28px;
    }
  }
`;

const QuestionsSection = styled.div`
  margin-top: 32px;
  padding: 28px;
  min-height: 350px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  animation: slideInUp 0.4s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
    border-radius: 20px 20px 0 0;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 24px;
  }
`;

const QuestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 3px solid #e2e8f0;
  gap: 20px;

  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;
const QuestionsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 60%;

  .icon {
    font-size: 32px;
    color: #3b82f6;
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    flex-shrink: 0;
  }

  .title-content {
    flex: 1;
    min-width: 0;

    .main-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
      line-height: 1.3;
      word-break: break-word;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 14px;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 500;
        white-space: nowrap;
      }

      .question-count {
        background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        color: #166534;
        border: 1px solid #bbf7d0;
      }

      .exam-type {
        background: linear-gradient(135deg, #fef3c7 0%, #fefce8 100%);
        color: #92400e;
        border: 1px solid #fde68a;
      }

      .subject-grade {
        background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
        color: #1e40af;
        border: 1px solid #bfdbfe;
      }

      @media (max-width: 768px) {
        font-size: 12px;
        gap: 8px;
      }
    }
  }

  @media (max-width: 768px) {
    gap: 12px;

    .icon {
      font-size: 28px;
      padding: 10px;
    }

    .title-content .main-title {
      font-size: 20px;
    }
  }
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  position: absolute;
  top: 0px;
  right: 3px;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(-1px) scale(0.98);
    transition: all 0.1s ease;
  }

  @media (max-width: 768px) {
    min-height: 50px;

    .btn-content {
      padding: 12px 16px;
    }

    .btn-text {
      font-size: 13px;
    }

    .btn-icon {
      font-size: 16px;
    }
  }
`;

const AddQuestionButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const ImportExcelButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  }

  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

const ExportTemplateButton = styled.button`
  background: linear-gradient(145deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  }
`;

const DeleteAllButton = styled.button`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  margin-right: 12px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  }
`;

const ActionButtonsDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  .icon {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  .text {
    position: relative;
    z-index: 1;
  }

  ${(props) =>
    props.isOpen &&
    `
    background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
    transform: translateY(-1px);
    
    .icon {
      transform: rotate(180deg);
    }
  `}
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15),
    0 10px 10px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 20px;
  min-width: 300px;
  z-index: 1000;
  margin-top: 8px;
  animation: slideDown 0.3s ease;
  backdrop-filter: blur(10px);

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    right: 20px;
    width: 16px;
    height: 16px;
    background: white;
    border: 1px solid #e5e7eb;
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    min-width: 280px;
    padding: 16px;
    right: -10px;

    &::before {
      right: 25px;
    }
  }
`;

const DropdownTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 12px;
`;

const ActionButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

// Level Selection Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalSubtitle = styled.p`
  color: #64748b;
  margin-bottom: 24px;
  font-size: 14px;
`;

const LevelOption = styled.button`
  width: 100%;
  padding: 16px 20px;
  margin-bottom: 12px;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  background: ${(props) => (props.selected ? "#eff6ff" : "white")};
  color: ${(props) => (props.selected ? "#1e40af" : "#374151")};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  &:last-child {
    margin-bottom: 24px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }
  `
      : `
    background: #f1f5f9;
    color: #64748b;
    &:hover {
      background: #e2e8f0;
    }
  `}
`;

const LevelBadge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;

  ${(props) => {
    switch (props.level) {
      case "de":
        return "background: #dcfce7; color: #166534;";
      case "trungbinh":
        return "background: #fef3c7; color: #92400e;";
      case "nangcao":
        return "background: #fee2e2; color: #991b1b;";
      default:
        return "background: #f1f5f9; color: #64748b;";
    }
  }}
`;

const Ontap = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State cho dữ liệu chính
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho questions display
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questionSets, setQuestionSets] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // State cho level selection modal
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");

  // State cho import Excel
  const [isImporting, setIsImporting] = useState(false);
  // State for Excel import file
  const [excelFile, setExcelFile] = useState(null);
  const [showImportLevelModal, setShowImportLevelModal] = useState(false);
  const [importSelectedLevel, setImportSelectedLevel] = useState(""); // Add separate state for import level

  // Debug logging for modal state
  useEffect(() => {
    console.log("showImportLevelModal changed to:", showImportLevelModal);
    console.log("importSelectedLevel:", importSelectedLevel);
    console.log("excelFile:", excelFile);
    console.log("selectedLesson:", selectedLesson?.refId?.title);
  }, [showImportLevelModal, importSelectedLevel, excelFile, selectedLesson]);

  // State cho export template
  const [isExporting, setIsExporting] = useState(false);

  // State cho import error modal
  const [isImportErrorModalOpen, setIsImportErrorModalOpen] = useState(false);
  const [importErrorData, setImportErrorData] = useState({});

  // State cho delete all questions
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // State cho hiển thị action buttons
  const [showActionButtons, setShowActionButtons] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionButtons && !event.target.closest(".action-dropdown")) {
        setShowActionButtons(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActionButtons]);

  // Khi nhấn nút import, lưu file và mở modal chọn mức độ
  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

    // Kiểm tra định dạng file
    if (
      !file.name.toLowerCase().endsWith(".xlsx") &&
      !file.name.toLowerCase().endsWith(".xls")
    ) {
      toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      event.target.value = "";
      return;
    }

    if (!selectedLesson?.refId?._id) {
      toast.error("Vui lòng chọn bài học để import câu hỏi!");
      event.target.value = "";
      return;
    }

    console.log("Setting up import modal...");
    setExcelFile(file);
    setImportSelectedLevel(""); // Reset import level
    setShowImportLevelModal(true);
    console.log("Modal should be visible now");
    event.target.value = "";
  };

  // Khi xác nhận mức độ import
  const handleConfirmImportLevel = async (level) => {
    if (!excelFile || !selectedLesson?.refId?._id) {
      toast.error("Thiếu file hoặc bài học!");
      setShowImportLevelModal(false);
      setExcelFile(null);
      setImportSelectedLevel("");
      return;
    }
    try {
      setIsImporting(true);
      setShowImportLevelModal(false);
      const formData = new FormData();
      formData.append("file", excelFile);
      formData.append("refType", "Lesson");
      formData.append("refId", selectedLesson.refId._id);
      formData.append("level", level);

      await importQuestionsViaExcel(formData);
      toast.success("Import file Excel thành công!");
      // Refresh questions for this lesson
      setQuestionsLoading(true);
      const questionSetsRes = await getQuestionSetsByLesson(
        selectedLesson.refId._id
      );
      const questionSetsData = parseQuestionSetsResponse(questionSetsRes);
      setQuestionSets(questionSetsData);

      setImportSelectedLevel("");
    } catch (error) {
      // Hiển thị error modal cho lỗi exception
      const errorResponse = error.response?.data;
      setImportErrorData({
        title: "Lỗi Import File Excel thất bại",
        message:
          errorResponse?.message || "Có lỗi xảy ra khi import file Excel",
        errors: errorResponse?.errors,
      });
      setIsImportErrorModalOpen(true);
      setImportSelectedLevel("");
    } finally {
      setIsImporting(false);
      setExcelFile(null);
      setQuestionsLoading(false);
    }
  };

  // Handle export template Excel
  const handleExportTemplate = async () => {
    try {
      setIsExporting(true);

      const response = await exportQuestionsToExcel();

      // Check if response contains a download URL
      if (response.data && response.data.downloadUrl) {
        // If API returns a download URL
        const link = document.createElement("a");
        link.href = response.data.downloadUrl;
        link.download = "file_mau_cau_hoi.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Direct file download from blob response
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file_mau_cau_hoi.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success("Tải xuống file mẫu thành công!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải file mẫu";
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseImportErrorModal = () => {
    setIsImportErrorModalOpen(false);
    setImportErrorData({});
  };

  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_ITEMS_PER_PAGE);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  // Simplified data fetching with single API call
  const fetchLessonsAndQuestions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both lessons and topics
      const [response, topicsRes] = await Promise.all([
        getAllQuestionSetsByLesson(),
        getAllTopics(),
      ]);

      console.log("API Response:", response); // Debug: Log full response

      // Parse the response to get lessons with questions
      let lessonsWithQuestions = [];

      if (response?.data?.data && Array.isArray(response.data.data)) {
        lessonsWithQuestions = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        lessonsWithQuestions = response.data;
      } else {
        console.warn("Unexpected API response structure:", response);
        lessonsWithQuestions = [];
      }

      console.log("Parsed lessons:", lessonsWithQuestions); // Debug: Log parsed lessons

      // Transform the data to match the expected structure
      const transformedLessons = lessonsWithQuestions.map((lesson) => {
        console.log("Raw lesson data:", lesson); // Debug: Log each lesson

        return {
          _id: `lessonQuestionSet_${lesson._id}`,
          refType: "Lesson", // ✅ Ensure this is always "Lesson"
          refId: lesson, // ✅ The entire lesson object as refId
          questionSets: lesson.questionSets || [],
          createdAt: lesson.createdAt,
          updatedAt: lesson.updatedAt,
        };
      });

      console.log("Transformed lessons:", transformedLessons); // Debug: Log transformed data
      setLessons(transformedLessons);

      // Set topics from API
      setTopics(topicsRes.data.data || []);

      console.log(
        `✅ Successfully loaded ${transformedLessons.length} lessons with questions`
      );
    } catch (error) {
      console.error("❌ Error loading lessons with questions:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetchLessonsAndQuestions();
  }, [fetchLessonsAndQuestions]);

  // Memoized computed values for better performance - including grades
  const uniqueGrades = useMemo(
    () =>
      [
        ...new Set(
          lessons
            .map((lesson) => lesson.refId?.topicId?.subjectId?.grade)
            .filter(Boolean)
        ),
      ].sort(),
    [lessons]
  );

  const uniqueSubjects = useMemo(
    () => [
      ...new Set(
        lessons
          .map((lesson) => lesson.refId?.topicId?.subjectId?.name)
          .filter(Boolean)
      ),
    ],
    [lessons]
  );

  const uniqueTopics = useMemo(
    () => [
      ...new Set(
        lessons.map((lesson) => lesson.refId?.topicId?.title).filter(Boolean)
      ),
    ],
    [lessons]
  );

  // Helper functions for cascading filters
  const getFilteredSubjects = useMemo(() => {
    if (!selectedGrade) return uniqueSubjects;
    return [
      ...new Set(
        lessons
          .filter(
            (lesson) =>
              lesson.refId?.topicId?.subjectId?.grade?.toString() ===
              selectedGrade
          )
          .map((lesson) => lesson.refId?.topicId?.subjectId?.name)
          .filter(Boolean)
      ),
    ];
  }, [lessons, selectedGrade, uniqueSubjects]);

  const getFilteredTopics = useMemo(() => {
    if (!selectedSubject) return uniqueTopics;
    return [
      ...new Set(
        topics
          .filter((topic) => {
            const matchesGrade =
              !selectedGrade ||
              topic.subjectId?.grade?.toString() === selectedGrade;
            const matchesSubject = topic.subjectId?.name === selectedSubject;
            return matchesGrade && matchesSubject;
          })
          .map((topic) => topic.title)
          .filter(Boolean)
      ),
    ];
  }, [topics, selectedGrade, selectedSubject, uniqueTopics]);

  // Reset cascading filters khi thay đổi grade
  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      const filteredSubjects = getFilteredSubjects;
      const subjectExists = filteredSubjects.includes(selectedSubject);
      if (!subjectExists) {
        setSelectedSubject("");
        setSelectedTopic("");
      }
    }
  }, [selectedGrade, getFilteredSubjects, selectedSubject]);

  // Reset topic khi thay đổi subject
  useEffect(() => {
    if (selectedSubject && selectedTopic) {
      const filteredTopics = getFilteredTopics;
      const topicExists = filteredTopics.includes(selectedTopic);
      if (!topicExists) {
        setSelectedTopic("");
      }
    }
  }, [selectedSubject, getFilteredTopics, selectedTopic]);

  // Get nested value for sorting - defined before use
  const getNestedValue = useCallback((obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  }, []);

  // Memoized filtered lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        !searchTerm ||
        lesson.refId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.refId?.topicId?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lesson.refId?.topicId?.subjectId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesGrade =
        !selectedGrade ||
        lesson.refId?.topicId?.subjectId?.grade?.toString() === selectedGrade;

      const matchesSubject =
        !selectedSubject ||
        lesson.refId?.topicId?.subjectId?.name === selectedSubject;

      const matchesTopic =
        !selectedTopic || lesson.refId?.topicId?.title === selectedTopic;

      return matchesSearch && matchesGrade && matchesSubject && matchesTopic;
    });
  }, [lessons, searchTerm, selectedGrade, selectedSubject, selectedTopic]);

  // Sort filtered lessons
  const getSortedLessons = useCallback(() => {
    if (!sortField) return filteredLessons;

    const sorted = [...filteredLessons].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Handle date fields
      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      // Handle text fields
      else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      // Handle question count fields
      else if (sortField === "questionSets") {
        aValue = Array.isArray(aValue)
          ? aValue.reduce(
              (total, set) => total + (set.questions?.length || 0),
              0
            )
          : 0;
        bValue = Array.isArray(bValue)
          ? bValue.reduce(
              (total, set) => total + (set.questions?.length || 0),
              0
            )
          : 0;
      }
      // Handle number fields
      else if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredLessons, sortField, sortDirection, getNestedValue]);

  const sortedLessons = getSortedLessons();

  // Memoized pagination
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLessons.slice(startIndex, endIndex);
  }, [sortedLessons, currentPage, itemsPerPage]);

  // Optimized event handlers
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedTopic("");
    setCurrentPage(1);
    // Reset sorting when clearing filters
    setSortField("");
    setSortDirection("asc");
  }, []);

  // Handle sorting
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        // If clicking the same field, toggle direction
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        // If clicking a new field, set it as sort field with ascending order
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const handleViewQuestions = useCallback(async (lesson) => {
    try {
      setQuestionsLoading(true);
      setSelectedLesson(lesson);

      if (lesson.questionSets?.length > 0) {
        setQuestionSets(lesson.questionSets);
        setShowQuestions(true);
      } else {
        const questionSetsRes = await getQuestionSetsByLesson(lesson.refId._id);
        const questionSetsData = parseQuestionSetsResponse(questionSetsRes);
        setQuestionSets(questionSetsData);
        setShowQuestions(true);
      }

      // Smooth scroll to questions section
      setTimeout(() => {
        document.querySelector("#questions-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, SCROLL_DELAY);
    } catch (error) {
      console.error("Error loading question sets:", error);
      setQuestionSets([]);
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  // Handle navigation state from AddQuestionsPage
  useEffect(() => {
    if (
      location.state?.showQuestions &&
      location.state?.lessonId &&
      lessons.length > 0
    ) {
      const targetLesson = lessons.find(
        (lesson) => lesson.refId._id === location.state.lessonId
      );
      if (targetLesson) {
        handleViewQuestions(targetLesson);
        // Clear the state to avoid re-triggering
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, lessons, handleViewQuestions]);

  const handleCloseQuestions = useCallback(() => {
    setShowQuestions(false);
    setSelectedLesson(null);
    setQuestionSets([]);
  }, []);

  const handleAddQuestions = useCallback(() => {
    console.log("Opening level selection for lesson:", selectedLesson);
    if (selectedLesson?.refId?._id) {
      setShowLevelModal(true);
    }
  }, [selectedLesson]);

  const handleLevelSelect = useCallback((level) => {
    setSelectedLevel(level);
  }, []);

  const handleConfirmAddQuestions = useCallback(() => {
    if (selectedLevel && selectedLesson?.refId?._id) {
      console.log(
        "Navigating to add questions for lesson:",
        selectedLesson,
        "Level:",
        selectedLevel
      );

      // Debug: Log the lesson data structure
      console.log("Selected lesson data:", {
        lessonId: selectedLesson.refId._id,
        lessonTitle: selectedLesson.refId.title,
        refType: selectedLesson.refType,
        fullLesson: selectedLesson,
      });

      navigate("/admin/add-questions", {
        state: {
          lessonId: selectedLesson.refId._id,
          lessonTitle: selectedLesson.refId.title,
          level: selectedLevel,
          refType: "Lesson", // ✅ Explicitly set refType as Lesson
          refId: selectedLesson.refId._id, // ✅ Add refId for compatibility
          source: "ontap",
        },
      });
      setShowLevelModal(false);
      setSelectedLevel("");
    }
  }, [navigate, selectedLesson, selectedLevel]);

  const handleCancelLevelModal = useCallback(() => {
    setShowLevelModal(false);
    setSelectedLevel("");
  }, []);

  // Question management functions
  const handleEditQuestion = useCallback(
    (question, questionSet) => {
      console.log("Editing question:", questionSet?.questionSetId);
      console.log("Selected lesson:", selectedLesson);
      console.log("Question to edit:", question?._id);

      // Use the same route structure as Tests.jsx but pass state for return navigation
      if (questionSet?.questionSetId && question?._id) {
        navigate(
          `/admin/sua-cau-hoi/${questionSet.questionSetId}/${question._id}`,
          {
            state: {
              source: "ontap",
              lessonId: selectedLesson?.refId?._id,
              lessonTitle: selectedLesson?.refId?.title,
            },
          }
        );
      }
    },
    [navigate, selectedLesson]
  );

  const handleDeleteQuestion = useCallback(
    async (question, questionSet) => {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa câu hỏi này?\n\nHành động này không thể hoàn tác.`
      );

      if (!confirmed) return;

      try {
        await deleteQuestionById(questionSet.questionSetId, question._id);
        toast.success("Xóa câu hỏi thành công!");

        // Immediately update the state without calling API again
        setQuestionSets((prevQuestionSets) =>
          prevQuestionSets.map((set) =>
            set._id === questionSet._id
              ? {
                  ...set,
                  questions: set.questions.filter(
                    (q) => q._id !== question._id
                  ),
                }
              : set
          )
        );

        // Also update the lessons state if needed
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson._id === selectedLesson._id
              ? {
                  ...lesson,
                  questionSets: lesson.questionSets.map((set) =>
                    set._id === questionSet._id
                      ? {
                          ...set,
                          questions: set.questions.filter(
                            (q) => q._id !== question._id
                          ),
                        }
                      : set
                  ),
                }
              : lesson
          )
        );
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error("Có lỗi xảy ra khi xóa câu hỏi");
      }
    },
    [selectedLesson]
  );

  // Handle delete all questions for a specific level
  const handleDeleteAllQuestions = useCallback(
    async (questionSet) => {
      if (!questionSet?.questionSetId) {
        toast.error("Không tìm thấy thông tin bộ câu hỏi");
        return;
      }

      const levelName =
        questionSet.level === "de"
          ? "Dễ"
          : questionSet.level === "trungbinh"
          ? "Trung bình"
          : "Nâng cao";

      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa TOÀN BỘ câu hỏi mức độ "${levelName}" trong bài học "${
          selectedLesson?.refId?.title
        }"?\n\nĐiều này sẽ xóa tất cả ${
          questionSet.questions?.length || 0
        } câu hỏi và không thể hoàn tác!`
      );

      if (!confirmed) return;

      try {
        setIsDeletingAll(true);

        await deleteAllQuestionsInSet(questionSet.questionSetId);

        toast.success(`Đã xóa toàn bộ câu hỏi mức độ ${levelName} thành công!`);

        // Cập nhật state bằng cách loại bỏ questionSet đã xóa
        setQuestionSets((prevQuestionSets) =>
          prevQuestionSets.filter((set) => set._id !== questionSet._id)
        );

        // Cập nhật lessons state
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson._id === selectedLesson._id
              ? {
                  ...lesson,
                  questionSets: lesson.questionSets.filter(
                    (set) => set._id !== questionSet._id
                  ),
                }
              : lesson
          )
        );
      } catch (error) {
        console.error("Error deleting all questions:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Có lỗi xảy ra khi xóa toàn bộ câu hỏi";
        toast.error(`Lỗi: ${errorMessage}`);
      } finally {
        setIsDeletingAll(false);
      }
    },
    [selectedLesson]
  );

  // Memoized filter configurations for better performance
  const filterConfigs = useMemo(
    () => [
      {
        label: "Khối",
        value: selectedGrade,
        onChange: setSelectedGrade,
        placeholder: "Tất cả khối",
        options: uniqueGrades.map((grade) => ({
          value: grade.toString(),
          label: `Khối ${grade}`,
        })),
      },
      {
        label: "Môn học",
        value: selectedSubject,
        onChange: setSelectedSubject,
        placeholder: "Tất cả môn học",
        options: getFilteredSubjects.map((subject) => ({
          value: subject,
          label: subject,
        })),
        disabled: !selectedGrade,
      },
      {
        label: "Chủ đề",
        value: selectedTopic,
        onChange: setSelectedTopic,
        placeholder: "Tất cả chủ đề",
        options: getFilteredTopics.map((topic) => ({
          value: topic,
          label: topic,
        })),
        disabled: !selectedSubject,
      },
    ],
    [
      selectedGrade,
      selectedSubject,
      selectedTopic,
      uniqueGrades,
      getFilteredSubjects,
      getFilteredTopics,
    ]
  );

  const searchConfig = useMemo(
    () => ({
      label: "Tìm kiếm bài học",
      placeholder: "Nhập tên bài học, chủ đề, môn học...",
      value: searchTerm,
      onChange: setSearchTerm,
    }),
    [searchTerm]
  );

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">�</span>
          <span className="text">Quản lý Bài học Ôn tập</span>
        </PageTitle>

        <AdvancedFilter
          searchConfig={searchConfig}
          filterConfigs={filterConfigs}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={ontapTableConfig.columns}
          data={paginatedLessons}
          loading={loading}
          actions={[
            {
              label: "👁️",
              variant: "view",
              onClick: handleViewQuestions,
              title: "Xem câu hỏi",
            },
            {
              label: "🛠️",
              variant: "special",
              onClick: (lesson) => {
                handleViewQuestions(lesson);
                setTimeout(() => setShowActionButtons(!showActionButtons), 500);
              },
              title: "Công cụ quản lý",
              style: {
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white",
              },
            },
          ]}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: sortedLessons.length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
          emptyMessage={
            loading
              ? "Đang tải bài học và câu hỏi..."
              : "Không có bài học nào phù hợp"
          }
        />

        {/* Questions Section */}
        {showQuestions && selectedLesson && (
          <QuestionsSection id="questions-section">
            <QuestionsHeader>
              <QuestionsTitle>
                <span className="icon">📝</span>
                <span className="text">
                  Câu hỏi: {selectedLesson.refId?.title || "N/A"}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      marginLeft: "8px",
                    }}
                  >
                    (
                    {questionSets.reduce(
                      (total, set) => total + (set.questions?.length || 0),
                      0
                    )}{" "}
                    câu hỏi)
                  </span>
                </span>
              </QuestionsTitle>
              <div>
                <ActionButtonsDropdown className="action-dropdown">
                  <ToggleButton
                    onClick={() => setShowActionButtons(!showActionButtons)}
                    isOpen={showActionButtons}
                  >
                    <span className="icon">⚡</span>
                    <span className="text">Quản lý câu hỏi</span>
                  </ToggleButton>

                  {showActionButtons && (
                    <DropdownMenu>
                      <DropdownTitle>
                        <span>🛠️</span>
                        Công cụ quản lý
                      </DropdownTitle>
                      <ActionButtonsGrid>
                        <AddQuestionButton
                          onClick={() => {
                            handleAddQuestions();
                            setShowActionButtons(false);
                          }}
                        >
                          ➕ Thêm câu hỏi
                        </AddQuestionButton>
                        <ExportTemplateButton
                          onClick={() => {
                            handleExportTemplate();
                            setShowActionButtons(false);
                          }}
                          disabled={isExporting}
                        >
                          {isExporting ? "⏳ Đang tải..." : "📄 Tải file mẫu"}
                        </ExportTemplateButton>
                        <ImportExcelButton
                          disabled={isImporting}
                          onClick={() => {
                            console.log("Import button clicked");
                            // Don't close dropdown immediately
                          }}
                        >
                          {isImporting
                            ? "⏳ Đang import..."
                            : "📊 Import Excel"}
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => {
                              console.log("File input changed");
                              handleImportExcel(e);
                              // Close dropdown after file selection
                              setShowActionButtons(false);
                            }}
                            disabled={isImporting}
                          />
                        </ImportExcelButton>
                      </ActionButtonsGrid>
                    </DropdownMenu>
                  )}
                </ActionButtonsDropdown>

                <CloseButton onClick={handleCloseQuestions}>✕</CloseButton>
              </div>
            </QuestionsHeader>

            {/* Display questions by level */}
            {questionSets && questionSets.length > 0 ? (
              questionSets.map((questionSet, index) => (
                <div
                  key={questionSet._id || index}
                  style={{ marginBottom: "32px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      padding: "12px 16px",
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      📚 Mức độ:{" "}
                      {questionSet.level === "de"
                        ? "Dễ"
                        : questionSet.level === "trungbinh"
                        ? "Trung bình"
                        : "Nâng cao"}
                      ({questionSet.questions?.length || 0} câu hỏi)
                    </h3>
                    <DeleteAllButton
                      onClick={() => handleDeleteAllQuestions(questionSet)}
                      disabled={isDeletingAll}
                      style={{
                        margin: 0,
                        padding: "8px 16px",
                        fontSize: "12px",
                      }}
                    >
                      {isDeletingAll ? "⏳ Đang xóa..." : "🗑️ Xóa tất cả"}
                    </DeleteAllButton>
                  </div>

                  <GenericTable
                    columns={questionsTableConfig.columns}
                    data={
                      questionSet.questions?.map((question, qIndex) => ({
                        ...question,
                        rowIndex: qIndex,
                      })) || []
                    }
                    loading={questionsLoading}
                    emptyMessage="Không có câu hỏi nào cho mức độ này"
                    showSTT={false}
                    actions={[
                      {
                        label: "✏️",
                        variant: "edit",
                        onClick: (question) =>
                          handleEditQuestion(question, questionSet),
                        title: "Chỉnh sửa câu hỏi",
                      },
                      {
                        label: "🗑️",
                        variant: "delete",
                        onClick: (question) =>
                          handleDeleteQuestion(question, questionSet),
                        title: "Xóa câu hỏi",
                      },
                    ]}
                    pagination={{
                      currentPage: 1,
                      itemsPerPage: 20,
                      totalItems: questionSet.questions?.length || 0,
                      onPageChange: () => {},
                      onItemsPerPageChange: () => {},
                    }}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b",
                  fontSize: "16px",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderRadius: "12px",
                  border: "2px dashed #cbd5e1",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <div style={{ fontWeight: "600", marginBottom: "8px" }}>
                  Không có câu hỏi nào cho bài ôn tập này
                </div>
                <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                  Hãy thêm câu hỏi bằng cách sử dụng các công cụ quản lý ở trên
                </div>
              </div>
            )}
          </QuestionsSection>
        )}

        {/* Level Selection Modal */}
        {showLevelModal && (
          <ModalOverlay onClick={handleCancelLevelModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalTitle>📚 Chọn mức độ câu hỏi</ModalTitle>
              <ModalSubtitle>
                Chọn mức độ để thêm câu hỏi vào bài học: "
                {selectedLesson?.refId?.title}"
              </ModalSubtitle>

              <LevelOption
                selected={selectedLevel === "de"}
                onClick={() => handleLevelSelect("de")}
              >
                <span style={{ fontSize: "18px" }}>🟢</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Dễ</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi cơ bản, dễ hiểu
                  </div>
                </div>
                <LevelBadge level="de">DỄ</LevelBadge>
              </LevelOption>

              <LevelOption
                selected={selectedLevel === "trungbinh"}
                onClick={() => handleLevelSelect("trungbinh")}
              >
                <span style={{ fontSize: "18px" }}>🟡</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Trung bình</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi vừa phải, cần suy nghĩ
                  </div>
                </div>
                <LevelBadge level="trungbinh">TRUNG BÌNH</LevelBadge>
              </LevelOption>

              <LevelOption
                selected={selectedLevel === "nangcao"}
                onClick={() => handleLevelSelect("nangcao")}
              >
                <span style={{ fontSize: "18px" }}>🔴</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Nâng cao</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi khó, đòi hỏi tư duy cao
                  </div>
                </div>
                <LevelBadge level="nangcao">NÂNG CAO</LevelBadge>
              </LevelOption>

              <ModalButtons>
                <ModalButton onClick={handleCancelLevelModal}>Hủy</ModalButton>
                <ModalButton
                  variant="primary"
                  onClick={handleConfirmAddQuestions}
                  disabled={!selectedLevel}
                  style={{
                    opacity: selectedLevel ? 1 : 0.5,
                    cursor: selectedLevel ? "pointer" : "not-allowed",
                  }}
                >
                  Tiếp tục
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Import Error Modal */}
        <ImportErrorModal
          isOpen={isImportErrorModalOpen}
          onClose={handleCloseImportErrorModal}
          errorData={importErrorData}
        />

        {/* Import Excel Level Selection Modal - Moved outside wrapper for better z-index */}
        {showImportLevelModal && (
          <ModalOverlay
            onClick={() => {
              console.log("Modal overlay clicked - closing modal");
              setShowImportLevelModal(false);
              setImportSelectedLevel("");
              setExcelFile(null);
            }}
          >
            <ModalContent
              onClick={(e) => {
                console.log("Modal content clicked");
                e.stopPropagation();
              }}
            >
              <ModalTitle>📚 Chọn mức độ cho file Excel</ModalTitle>
              <ModalSubtitle>
                Chọn mức độ để import câu hỏi vào bài học: "
                {selectedLesson?.refId?.title}"
              </ModalSubtitle>
              <LevelOption
                selected={importSelectedLevel === "de"}
                onClick={() => {
                  console.log("Selected level: de");
                  setImportSelectedLevel("de");
                }}
              >
                <span style={{ fontSize: "18px" }}>🟢</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Dễ</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi cơ bản, dễ hiểu
                  </div>
                </div>
                <LevelBadge level="de">DỄ</LevelBadge>
              </LevelOption>
              <LevelOption
                selected={importSelectedLevel === "trungbinh"}
                onClick={() => {
                  console.log("Selected level: trungbinh");
                  setImportSelectedLevel("trungbinh");
                }}
              >
                <span style={{ fontSize: "18px" }}>🟡</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Trung bình</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi vừa phải, cần suy nghĩ
                  </div>
                </div>
                <LevelBadge level="trungbinh">TRUNG BÌNH</LevelBadge>
              </LevelOption>
              <LevelOption
                selected={importSelectedLevel === "nangcao"}
                onClick={() => {
                  console.log("Selected level: nangcao");
                  setImportSelectedLevel("nangcao");
                }}
              >
                <span style={{ fontSize: "18px" }}>🔴</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div>Nâng cao</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Câu hỏi khó, nâng cao tư duy
                  </div>
                </div>
                <LevelBadge level="nangcao">NÂNG CAO</LevelBadge>
              </LevelOption>
              <ModalButtons>
                <ModalButton
                  onClick={() => {
                    console.log("Cancel button clicked");
                    setShowImportLevelModal(false);
                    setImportSelectedLevel("");
                    setExcelFile(null);
                  }}
                >
                  Hủy
                </ModalButton>
                <ModalButton
                  variant="primary"
                  disabled={!importSelectedLevel}
                  onClick={() => {
                    console.log(
                      "Confirm button clicked with level:",
                      importSelectedLevel
                    );
                    handleConfirmImportLevel(importSelectedLevel);
                  }}
                >
                  Xác nhận
                </ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </Wrapper>
    </>
  );
};

export default Ontap;
