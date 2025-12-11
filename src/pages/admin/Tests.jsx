import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaUsers,
  FaQuestionCircle,
  FaSpinner,
  FaDownload,
  FaFileExcel,
  FaCog,
} from "react-icons/fa";
import {
  getAllExams,
  getAllSubjects,
  getQuestionsByExam,
  createExam,
  updateExam,
  deleteExam,
  deleteQuestionById,
  deleteAllQuestionsInSet,
  importQuestionsViaExcel,
  updateQuestionByTextpassgae,
  exportQuestionsToExcel,
} from "../../services/apiService";
import GenericTable from "../../components/admin/GenericTable";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import ExamFormModal from "../../components/admin/exam/ExamFormModal";
import ImportErrorModal from "../../components/admin/ImportErrorModal";
import {
  testsTableConfig,
  questionsTableConfig,
} from "../../components/admin/tableConfigs";

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
  min-height: 350px;
  padding: 28px;
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
    z-index: 2;

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
  background: linear-gradient(145deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  margin-right: 12px;

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

const PassageSection = styled.div`
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PassageTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    font-size: 20px;
    color: #3b82f6;
  }
`;

const PassageContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  white-space: pre-wrap;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  position: relative;
`;

const EditPassageButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseModalButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #dc2626;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4b5563;
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
  z-index: 10;
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

const Tests = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State cho dữ liệu chính
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // State cho questions display
  const [selectedTest, setSelectedTest] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // State cho import Excel
  const [isImporting, setIsImporting] = useState(false);

  // State cho export template
  const [isExporting, setIsExporting] = useState(false);

  // State cho edit passage modal
  const [isEditPassageModalOpen, setIsEditPassageModalOpen] = useState(false);
  const [editingPassageText, setEditingPassageText] = useState("");
  const [isPassageSaving, setIsPassageSaving] = useState(false);

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

  // State cho filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchExamsAndQuestions = async () => {
      setLoading(true);
      try {
        const [examsRes, subjectsRes] = await Promise.all([
          getAllExams(),
          getAllSubjects(),
        ]);

        const examsData = examsRes?.data?.data?.exams || [];
        const subjectsData = subjectsRes?.data?.data || [];
        setSubjects(subjectsData);

        if (examsData.length === 0) {
          setTests([]);
          return;
        }

        // Lấy câu hỏi cho từng exam
        const testsWithQuestions = await Promise.all(
          examsData.map(async (exam) => {
            try {
              const questionsRes = await getQuestionsByExam(exam._id);
              const questionsData = questionsRes.data.data || [];

              return {
                _id: `questionSet_${exam._id}`,
                refType: "Exam",
                refId: exam,
                questions: questionsData,
                createdAt: exam.createdAt,
                updatedAt: exam.updatedAt,
              };
            } catch {
              toast.error(
                "Có lỗi xảy ra khi tải câu hỏi cho một số bài kiểm tra"
              );
              return {
                _id: `questionSet_${exam._id}`,
                refType: "Exam",
                refId: exam,
                questions: [],
                createdAt: exam.createdAt,
                updatedAt: exam.updatedAt,
              };
            }
          })
        );

        setTests(testsWithQuestions);
      } catch {
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchExamsAndQuestions();
  }, []);

  // Handle navigation state from AddQuestionsPage
  useEffect(() => {
    if (
      location.state?.showQuestions &&
      location.state?.examId &&
      tests.length > 0
    ) {
      const targetTest = tests.find(
        (test) => test.refId._id === location.state.examId
      );
      if (targetTest) {
        handleViewQuestions(targetTest);
        // Clear the state to avoid re-triggering
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, tests]);

  // Lấy danh sách unique grades, subjects và exam types với memoization
  const uniqueGrades = useMemo(
    () =>
      [
        ...new Set(
          tests.map((test) => test.refId?.subjectId?.grade).filter(Boolean)
        ),
      ].sort(),
    [tests]
  );

  const uniqueSubjects = useMemo(
    () => [
      ...new Set(
        tests.map((test) => test.refId?.subjectId?.name).filter(Boolean)
      ),
    ],
    [tests]
  );

  // Định nghĩa các loại kiểm tra cố định và thay thế "Topic" bằng "Chủ đề"
  const examTypes = ["Giữa kỳ", "Cuối kỳ", "Chủ đề"];

  // Helper functions for cascading filters
  const getFilteredSubjects = useMemo(() => {
    if (!selectedGrade) return uniqueSubjects;
    return [
      ...new Set(
        tests
          .filter(
            (test) => test.refId?.subjectId?.grade?.toString() === selectedGrade
          )
          .map((test) => test.refId?.subjectId?.name)
          .filter(Boolean)
      ),
    ];
  }, [tests, selectedGrade, uniqueSubjects]);

  // Reset cascading filters khi thay đổi grade
  useEffect(() => {
    if (selectedGrade && selectedSubject) {
      const filteredSubjects = getFilteredSubjects;
      const subjectExists = filteredSubjects.includes(selectedSubject);
      if (!subjectExists) {
        setSelectedSubject("");
      }
    }
  }, [selectedGrade, getFilteredSubjects, selectedSubject]);

  // Get nested value for sorting - defined before use
  const getNestedValue = useCallback((obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  }, []);

  // Filter dữ liệu theo tất cả điều kiện với memoization
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        !searchTerm ||
        test.refId?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        test.refId?.subjectId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        test.refId?.examType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade =
        !selectedGrade ||
        test.refId?.subjectId?.grade?.toString() === selectedGrade;

      const matchesSubject =
        !selectedSubject || test.refId?.subjectId?.name === selectedSubject;

      // Map examType để phù hợp với dữ liệu API (có thể cần điều chỉnh dựa trên cấu trúc thực tế)
      const matchesExamType =
        !selectedExamType ||
        (() => {
          const apiExamType = test.refId?.examType?.toLowerCase();
          switch (selectedExamType) {
            case "Giữa kỳ":
              return apiExamType === "midterm" || apiExamType === "giữa kỳ";
            case "Cuối kỳ":
              return apiExamType === "final" || apiExamType === "cuối kỳ";
            case "Chủ đề":
              return apiExamType === "topic" || apiExamType === "chủ đề";
            default:
              return true;
          }
        })();

      return matchesSearch && matchesGrade && matchesSubject && matchesExamType;
    });
  }, [tests, searchTerm, selectedGrade, selectedSubject, selectedExamType]);

  // Sort filtered tests
  const getSortedTests = useCallback(() => {
    if (!sortField) return filteredTests;

    const sorted = [...filteredTests].sort((a, b) => {
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
      // Handle number fields (grade, rewardNuts)
      else if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredTests, sortField, sortDirection, getNestedValue]);

  const sortedTests = getSortedTests();

  // Tính toán pagination với memoization
  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTests.slice(startIndex, endIndex);
  }, [sortedTests, currentPage, itemsPerPage]);

  // Xử lý clear filters với useCallback
  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedExamType("");
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

  // Xử lý thao tác CRUD
  const handleAddTest = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateExam = async (examData) => {
    try {
      setIsModalLoading(true);

      // Gọi API tạo exam
      await createExam(examData);

      // Refresh data sau khi tạo thành công
      const [examsRes, subjectsRes] = await Promise.all([
        getAllExams(),
        getAllSubjects(),
      ]);

      const examsData = examsRes?.data?.data?.exams || [];
      setSubjects(subjectsRes?.data?.data || []);

      const testsWithQuestions = await Promise.all(
        examsData.map(async (exam) => {
          try {
            const questionsRes = await getQuestionsByExam(exam._id);
            const questionsData = questionsRes.data.data || [];

            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: questionsData,
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          } catch {
            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: [],
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          }
        })
      );

      setTests(testsWithQuestions);
      setIsAddModalOpen(false);
      toast.success("Bài kiểm tra đã được tạo thành công!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo bài kiểm tra";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleEditTest = (test) => {
    if (test?.refId) {
      setSelectedExam(test.refId);
      setIsEditModalOpen(true);
    }
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExam(null);
  };

  const handleUpdateExam = async (examData) => {
    if (!selectedExam) {
      toast.error("Không có bài kiểm tra nào được chọn để cập nhật");
      return;
    }

    try {
      setIsModalLoading(true);

      // Gọi API update exam
      await updateExam(selectedExam._id, examData);

      // Refresh data sau khi update thành công
      const [examsRes, subjectsRes] = await Promise.all([
        getAllExams(),
        getAllSubjects(),
      ]);

      const examsData = examsRes?.data?.data?.exams || [];
      setSubjects(subjectsRes?.data?.data || []);

      const testsWithQuestions = await Promise.all(
        examsData.map(async (exam) => {
          try {
            const questionsRes = await getQuestionsByExam(exam._id);
            const questionsData = questionsRes.data.data || [];

            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: questionsData,
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          } catch {
            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: [],
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          }
        })
      );
      setTests(testsWithQuestions);
      setIsEditModalOpen(false);
      setSelectedExam(null);
      toast.success("Bài kiểm tra đã được cập nhật thành công!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật bài kiểm tra";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteTest = async (test) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài kiểm tra "${test.refId?.description}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteExam(test.refId._id);
      toast.success("Xóa bài kiểm tra thành công!");

      // Refresh data
      const [examsRes, subjectsRes] = await Promise.all([
        getAllExams(),
        getAllSubjects(),
      ]);

      const examsData = examsRes?.data?.data?.exams || [];
      setSubjects(subjectsRes?.data?.data || []);

      const testsWithQuestions = await Promise.all(
        examsData.map(async (exam) => {
          try {
            const questionsRes = await getQuestionsByExam(exam._id);
            const questionsData = questionsRes.data.data || [];

            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: questionsData,
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          } catch {
            return {
              _id: `questionSet_${exam._id}`,
              refType: "Exam",
              refId: exam,
              questions: [],
              createdAt: exam.createdAt,
              updatedAt: exam.updatedAt,
            };
          }
        })
      );

      setTests(testsWithQuestions);
    } catch {
      toast.error("Có lỗi xảy ra khi xóa bài kiểm tra");
    }
  };

  const handleViewQuestions = async (test) => {
    try {
      setQuestionsLoading(true);
      setSelectedTest(test);

      if (test.questions?.length > 0) {
        setQuestions(test.questions);
        setShowQuestions(true);
      } else {
        const questionsRes = await getQuestionsByExam(test.refId._id);
        const questionsData = questionsRes.data.data || [];
        setQuestions(questionsData);
        setShowQuestions(true);
      }

      // Smooth scroll to questions section
      setTimeout(() => {
        document.querySelector("#questions-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch {
      toast.error("Có lỗi xảy ra khi tải câu hỏi cho bài kiểm tra");
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Question management functions
  const refreshQuestions = async () => {
    if (!selectedTest) return;

    try {
      const questionsRes = await getQuestionsByExam(selectedTest.refId._id);
      const questionsData = questionsRes.data.data || [];

      // Cập nhật questions state
      setQuestions(questionsData);

      // Cập nhật selectedTest để đảm bảo getPassageText có dữ liệu mới
      setSelectedTest((prevTest) => ({
        ...prevTest,
        questions: questionsData,
      }));

      // Cập nhật test trong main list
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === selectedTest._id
            ? { ...test, questions: questionsData }
            : test
        )
      );
    } catch {
      toast.error("Có lỗi xảy ra khi tải lại câu hỏi");
    }
  };

  const handleAddQuestion = () => {
    if (selectedTest?.refId?._id) {
      // Lấy textPassage từ dữ liệu hiện tại để truyền sang trang thêm câu hỏi
      const existingPassage = getPassageText;

      navigate(`/admin/them-cau-hoi/${selectedTest.refId._id}`, {
        state: {
          existingTextPassage: existingPassage || "",
        },
      });
    }
  };

  const handleEditQuestion = (question) => {
    if (selectedTest?.questions?.[0]?._id && question?._id) {
      navigate(
        `/admin/sua-cau-hoi/${selectedTest?.questions?.[0]?._id}/${question._id}`
      );
    }
  };

  const handleDeleteQuestion = async (question) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa câu hỏi này?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteQuestionById(selectedTest?.questions?.[0]?._id, question._id);
      toast.success("Xóa câu hỏi thành công!");
      await refreshQuestions();
    } catch {
      toast.error("Có lỗi xảy ra khi xóa câu hỏi");
    }
  };

  // Handle delete all questions
  const handleDeleteAllQuestions = async () => {
    const questionSetId = selectedTest?.questions?.[0]?._id;

    if (!questionSetId) {
      toast.error("Không tìm thấy thông tin bộ câu hỏi");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa TOÀN BỘ câu hỏi trong bài kiểm tra "${selectedTest.refId?.description}"?\n\nĐiều này sẽ xóa tất cả các câu hỏi và không thể hoàn tác!`
    );

    if (!confirmed) return;

    try {
      setIsDeletingAll(true);

      await deleteAllQuestionsInSet(questionSetId);

      toast.success("Đã xóa toàn bộ câu hỏi thành công!");

      // Refresh questions sau khi xóa
      await refreshQuestions();
    } catch (error) {
      console.error("Error deleting all questions:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi xóa toàn bộ câu hỏi";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (
      !file.name.toLowerCase().endsWith(".xlsx") &&
      !file.name.toLowerCase().endsWith(".xls")
    ) {
      toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    if (!selectedTest?.refId?._id) {
      toast.error("Vui lòng chọn bài kiểm tra trước khi import");
      return;
    }

    try {
      setIsImporting(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("refType", "Exam");
      formData.append("refId", selectedTest.refId._id);

      const response = await importQuestionsViaExcel(formData);

      if (response.data.success) {
        toast.success(`Import thành công câu hỏi!`);
        // Refresh questions
        await refreshQuestions();
      } else {
        // Hiển thị error modal với chi tiết lỗi
        const errorData = response.data;
        setImportErrorData({
          title: "Lỗi Import File Excel",
          message: errorData.message || "Import file Excel thất bại",
          details: errorData.details || [],
          errors: errorData.errors || [],
        });
        setIsImportErrorModalOpen(true);
      }
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
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = "";
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
        link.setAttribute("download", "question_template.xlsx");
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        // If API returns file data directly, ensure we handle it as blob
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "question_template.xlsx");
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

  // Function to extract passage text from questions data using questionSetId
  const getPassageText = useMemo(() => {
    const questionSetId = selectedTest?.questions?.[0]?._id;

    if (!questionSetId) return null;

    // Check for textPassage at the top level of the question set
    if (
      selectedTest?.questions?.[0]?.textPassage &&
      selectedTest.questions[0].textPassage.trim()
    ) {
      return selectedTest.questions[0].textPassage.trim();
    }

    // Also check in the questions array if it's stored there
    if (questions?.[0]?.textPassage && questions[0].textPassage.trim()) {
      return questions[0].textPassage.trim();
    }

    // Fallback: check for other possible field names at top level
    if (
      selectedTest?.questions?.[0]?.passageText &&
      selectedTest.questions[0].passageText.trim()
    ) {
      return selectedTest.questions[0].passageText.trim();
    }

    if (questions?.[0]?.passageText && questions[0].passageText.trim()) {
      return questions[0].passageText.trim();
    }

    return null;
  }, [selectedTest?.questions, questions]);

  // Handle edit passage functions
  const handleEditPassage = () => {
    setEditingPassageText(getPassageText || "");
    setIsEditPassageModalOpen(true);
  };

  const handleClosePassageModal = () => {
    setIsEditPassageModalOpen(false);
    setEditingPassageText("");
  };

  const handleCloseImportErrorModal = () => {
    setIsImportErrorModalOpen(false);
    setImportErrorData({});
  };

  const handleSavePassage = async () => {
    const questionSetId = selectedTest?.questions?.[0]?._id;

    if (!questionSetId) {
      toast.error("Không tìm thấy thông tin questionSetId");
      return;
    }

    try {
      setIsPassageSaving(true);

      const dataToUpdate = {
        textPassage: editingPassageText.trim(),
      };

      await updateQuestionByTextpassgae(questionSetId, dataToUpdate);

      toast.success("Cập nhật đoạn văn thành công!");

      // Đóng modal trước
      setIsEditPassageModalOpen(false);
      setEditingPassageText("");

      // Refresh questions để lấy dữ liệu mới nhất
      await refreshQuestions();

      // Cập nhật selectedTest để getPassageText có thể lấy dữ liệu mới
      if (selectedTest?.refId?._id) {
        try {
          const questionsRes = await getQuestionsByExam(selectedTest.refId._id);
          const questionsData = questionsRes.data.data || [];

          // Cập nhật selectedTest với dữ liệu mới
          setSelectedTest((prevTest) => ({
            ...prevTest,
            questions: questionsData,
          }));

          // Cập nhật questions state
          setQuestions(questionsData);

          // Cập nhật tests list để đồng bộ dữ liệu
          setTests((prevTests) =>
            prevTests.map((test) =>
              test._id === selectedTest._id
                ? { ...test, questions: questionsData }
                : test
            )
          );

          // Scroll lại đến questions section giống như khi thêm câu hỏi thành công
          setTimeout(() => {
            document.querySelector("#questions-section")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        } catch {
          // Error refreshing data after passage update
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật đoạn văn";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsPassageSaving(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">📋</span>
          <span className="text">Quản lý Bài kiểm tra</span>
        </PageTitle>

        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm bài kiểm tra",
            placeholder: "Nhập mô tả, môn học, loại kiểm tra...",
            value: searchTerm,
            onChange: setSearchTerm,
          }}
          filterConfigs={[
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
              label: "Loại kiểm tra",
              value: selectedExamType,
              onChange: setSelectedExamType,
              placeholder: "Tất cả loại kiểm tra",
              options: examTypes.map((type) => ({
                value: type,
                label: type,
              })),
            },
          ]}
          addButtonConfig={{
            text: "Thêm bài kiểm tra",
            onClick: handleAddTest,
          }}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={testsTableConfig.columns}
          data={paginatedTests}
          loading={loading}
          actions={[
            {
              label: "🔍",
              variant: "view",
              onClick: handleViewQuestions,
              title: "Xem câu hỏi",
            },
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEditTest,
              title: "Chỉnh sửa bài kiểm tra",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDeleteTest,
              title: "Xóa bài kiểm tra",
            },
          ]}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: sortedTests.length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
          emptyMessage="Không có bài kiểm tra nào phù hợp"
        />

        {/* Questions Section */}
        {showQuestions && selectedTest && (
          <QuestionsSection id="questions-section">
            <QuestionsHeader>
              <QuestionsTitle>
                <span className="icon">📝</span>
                <div className="title-content">
                  <h2 className="main-title">
                    {selectedTest.refId?.description || "Bài kiểm tra"}
                  </h2>
                  <div className="metadata">
                    <span className="question-count">
                      📊{" "}
                      {selectedTest?.questions?.[0]?.questions?.length ||
                        questions.length}{" "}
                      câu hỏi
                    </span>
                    <span className="exam-type">
                      📋{" "}
                      {selectedTest.refId?.examType === "midterm"
                        ? "Giữa kỳ"
                        : selectedTest.refId?.examType === "final"
                        ? "Cuối kỳ"
                        : selectedTest.refId?.examType === "topic"
                        ? "Chủ đề"
                        : selectedTest.refId?.examType || "Không xác định"}
                    </span>
                    <span className="subject-grade">
                      🎓 {selectedTest.refId?.subjectId?.name} - Khối{" "}
                      {selectedTest.refId?.subjectId?.grade}
                    </span>
                  </div>
                </div>
              </QuestionsTitle>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <ActionButtonsDropdown className="action-dropdown">
                  <ToggleButton
                    onClick={() => setShowActionButtons(!showActionButtons)}
                    isOpen={showActionButtons}
                  >
                    <FaCog className="icon" />
                    <span className="text">Thao tác</span>
                  </ToggleButton>
                  {showActionButtons && (
                    <DropdownMenu>
                      <DropdownTitle>
                        <FaQuestionCircle style={{ color: "#3b82f6" }} />
                        Quản lý câu hỏi
                      </DropdownTitle>
                      <ActionButtonsGrid>
                        <AddQuestionButton onClick={handleAddQuestion}>
                          <FaPlus /> Thêm câu hỏi
                        </AddQuestionButton>
                        <ImportExcelButton disabled={isImporting}>
                          {isImporting ? (
                            <>
                              <FaSpinner className="fa-spin" /> Đang tải lên...
                            </>
                          ) : (
                            <>
                              <FaFileExcel /> Import Excel
                            </>
                          )}
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleImportExcel}
                            disabled={isImporting}
                          />
                        </ImportExcelButton>
                        <ExportTemplateButton
                          onClick={handleExportTemplate}
                          disabled={isExporting}
                        >
                          {isExporting ? (
                            <>
                              <FaSpinner className="fa-spin" /> Đang tải...
                            </>
                          ) : (
                            <>
                              <FaDownload /> Tải mẫu
                            </>
                          )}
                        </ExportTemplateButton>
                      </ActionButtonsGrid>
                    </DropdownMenu>
                  )}
                </ActionButtonsDropdown>
                <DeleteAllButton
                  onClick={handleDeleteAllQuestions}
                  disabled={isDeletingAll}
                >
                  {isDeletingAll ? (
                    <>
                      <FaSpinner className="fa-spin" /> Đang xóa...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Xóa tất cả
                    </>
                  )}
                </DeleteAllButton>
                <CloseButton
                  onClick={() => {
                    setShowQuestions(false);
                    setSelectedTest(null);
                    setQuestions([]);
                  }}
                >
                  ✕
                </CloseButton>
              </div>
            </QuestionsHeader>

            {/* Passage Section - Display passage text if it exists */}
            {getPassageText && (
              <PassageSection>
                <PassageTitle>
                  <span className="icon">📖</span>
                  Đoạn văn
                </PassageTitle>
                <PassageContent>
                  {getPassageText}
                  <EditPassageButton onClick={handleEditPassage}>
                    ✏️ Sửa đoạn văn
                  </EditPassageButton>
                </PassageContent>
              </PassageSection>
            )}

            <GenericTable
              columns={questionsTableConfig.columns}
              data={(() => {
                // Lấy đúng array 10 câu hỏi từ nested structure
                let realQuestions = [];

                if (
                  selectedTest?.questions?.[0]?.questions &&
                  Array.isArray(selectedTest.questions[0].questions)
                ) {
                  realQuestions = selectedTest.questions[0].questions;
                } else if (questions && Array.isArray(questions)) {
                  realQuestions = questions;
                }

                return realQuestions.map((question, index) => ({
                  ...question,
                  rowIndex: index,
                }));
              })()}
              loading={questionsLoading}
              emptyMessage="Không có câu hỏi nào cho bài kiểm tra này"
              showSTT={false} // We're using custom STT in the config
              actions={[
                {
                  label: "✏️",
                  variant: "edit",
                  onClick: handleEditQuestion,
                  title: "Chỉnh sửa câu hỏi",
                },
                {
                  label: "🗑️",
                  variant: "delete",
                  onClick: handleDeleteQuestion,
                  title: "Xóa câu hỏi",
                },
              ]}
              pagination={{
                currentPage: 1,
                itemsPerPage: 10,
                totalItems:
                  selectedTest?.questions?.[0]?.questions?.length ||
                  questions.length,
                onPageChange: () => {},
                onItemsPerPageChange: () => {},
              }}
            />
          </QuestionsSection>
        )}
      </Wrapper>

      {/* Add Test Modal */}
      <ExamFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateExam}
        isLoading={isModalLoading}
        subjects={subjects}
        mode="add"
        title="Thêm Bài Kiểm Tra Mới"
        preSelectedFilters={{
          grade: selectedGrade,
          subject: selectedSubject,
          examType: selectedExamType,
        }}
      />

      {/* Edit Test Modal */}
      <ExamFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateExam}
        isLoading={isModalLoading}
        subjects={subjects}
        mode="edit"
        title="Sửa Bài Kiểm Tra"
        initialData={selectedExam}
      />

      {/* Edit Passage Modal */}
      {isEditPassageModalOpen && (
        <ModalOverlay onClick={handleClosePassageModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <span>📖</span>
                Chỉnh sửa đoạn văn
              </ModalTitle>
              <CloseModalButton onClick={handleClosePassageModal}>
                ✕ Đóng
              </CloseModalButton>
            </ModalHeader>

            <div>
              <TextArea
                value={editingPassageText}
                onChange={(e) => setEditingPassageText(e.target.value)}
                placeholder="Nhập nội dung đoạn văn..."
              />
            </div>

            <ModalFooter>
              <CancelButton onClick={handleClosePassageModal}>
                Hủy bỏ
              </CancelButton>
              <SaveButton
                onClick={handleSavePassage}
                disabled={isPassageSaving}
              >
                {isPassageSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </SaveButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Import Error Modal */}
      <ImportErrorModal
        isOpen={isImportErrorModalOpen}
        onClose={handleCloseImportErrorModal}
        errorData={importErrorData}
      />
    </>
  );
};

export default Tests;
