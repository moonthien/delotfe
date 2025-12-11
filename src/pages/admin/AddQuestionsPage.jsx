import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  createMultipleQuestions,
  updateQuestionById,
  getQuestionById,
} from "../../services/apiService";
import DynamicQuestionsForm from "../../components/admin/question/DynamicQuestionsForm";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  html, body { 
    width: 100%; 
    height: 100%; 
    overflow-x: hidden;
    overflow-y: auto;
    font-family: 'Montserrat', sans-serif; 
    background: #f8fafc;
  }
  #root { 
    width: 100%; 
    min-height: 100vh;
    overflow: visible;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 40px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #e2e8f0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
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
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(107, 114, 128, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const FormContainer = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 30px;
  border: 2px solid #e2e8f0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  min-width: 140px;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  min-width: 140px;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

const AddQuestionsPage = () => {
  const navigate = useNavigate();
  const { examId, questionId, lessonId } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [initialTextPassage, setInitialTextPassage] = useState("");
  const [mode, setMode] = useState("add");
  const formRef = useRef(null);

  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        setIsLoading(true);
        const response = await getQuestionById(examId, questionId);
        const questionData = response.data.data;
        console.log("Loaded question data:", questionData);
        console.log("Question options:", questionData?.question?.questionText);

        // Determine question type based on options
        const hasOptions =
          questionData.question.options &&
          Object.keys(questionData.question.options).length > 0;
        const questionType = hasOptions ? "multiple_choice" : "essay";

        // Convert API format to form format
        const formData = [
          {
            question: questionData?.question?.questionText,
            questionType: questionType,
            isReadingQuestion:
              questionData?.question?.isReadingQuestion || false, // Add isReadingQuestion from API
            optionA: questionData?.question?.options?.A || "",
            optionB: questionData?.question?.options?.B || "",
            optionC: questionData?.question?.options?.C || "",
            optionD: questionData?.question?.options?.D || "",
            correctAnswer: questionData?.question?.correctAnswer || "",
            sampleAnswer:
              questionType === "essay"
                ? questionData?.question?.correctAnswer || ""
                : "",
            explanation: questionData?.question?.explanation || "", // Thêm explanation từ API
          },
        ];
        console.log("Converted form data:", formData);

        setInitialData(formData);

        // Also set textPassage if it exists at the questionSet level
        if (questionData?.textPassage) {
          setInitialTextPassage(questionData.textPassage);
        }
      } catch (error) {
        console.error("Error loading question:", error);
        toast.error("Có lỗi xảy ra khi tải câu hỏi");
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      // Edit mode
      setMode("edit");
      loadQuestionData();
    } else {
      // Add mode - check if there's existing textPassage from navigation state
      const existingPassage = location.state?.existingTextPassage;
      if (existingPassage) {
        setInitialTextPassage(existingPassage);
      }
    }
  }, [questionId, examId, location.state]);

  const handleBack = () => {
    // Check if coming from Ontap page
    if (location.state?.source === "ontap") {
      navigate("/admin/ontap", {
        state: {
          showQuestions: true,
          lessonId: location.state?.lessonId || location.state?.refId,
          lessonTitle: location.state?.lessonTitle,
        },
      });
    } else {
      // Navigate back to Tests page with questions view state
      navigate("/admin/bai-kiem-tra", {
        state: {
          showQuestions: true,
          examId: examId,
        },
      });
    }
  };

  const handleSubmit = async (formData) => {
    console.log("Received formData:", formData);

    // Extract questions array from the new format
    const questionsArray = formData.questions || formData;

    console.log("Extracted questionsArray:", questionsArray);
    console.log("Is questionsArray an array?", Array.isArray(questionsArray));

    if (
      !questionsArray ||
      !Array.isArray(questionsArray) ||
      questionsArray.length === 0
    ) {
      toast.error("Vui lòng thêm ít nhất một câu hỏi!");
      return;
    }

    try {
      setIsLoading(true);

      if (mode === "edit" && questionId) {
        // Edit single question
        const question = questionsArray[0];
        const dataToSend = {
          refType: "Exam",
          refId: examId,
          questionText: question.question,
          options: {}, // Always include options field
          isReadingQuestion: question.isReadingQuestion || false, // Add isReadingQuestion for single question
          explanation: question.explanation || "", // Thêm explanation cho edit mode
        };

        // Add conditional fields based on question type
        if (question.type === "multiple_choice") {
          dataToSend.options = question.options || {};
          dataToSend.correctAnswer = question.correctAnswer;
        } else {
          dataToSend.options = {}; // Empty object for essay questions
          dataToSend.correctAnswer = question.sampleAnswer || ""; // Use sample answer as correct answer for essay
        }

        // Add textPassage if it exists and is not empty
        if (formData.textPassage && formData.textPassage.trim()) {
          dataToSend.textPassage = formData.textPassage.trim();
        }

        await updateQuestionById(examId, questionId, dataToSend);
        toast.success("Cập nhật câu hỏi thành công!");

        // Navigate back based on source after successful update
        if (location.state?.source === "ontap") {
          navigate("/admin/ontap", {
            state: {
              showQuestions: true,
              lessonId: location.state?.lessonId,
              lessonTitle: location.state?.lessonTitle,
            },
          });
          return; // Exit early to avoid the navigation logic below
        }
      } else {
        // Add multiple questions using the batch API
        const questionsToCreate = questionsArray.map((question) => {
          const questionData = {
            questionText: question.question,
            options: {}, // Always include options field, even if empty for essay questions
            correctAnswer: "", // Always include correctAnswer field
            isReadingQuestion: question.isReadingQuestion || false, // Add isReadingQuestion for each question
            explanation: question.explanation || "", // Thêm explanation
          };

          // Add conditional fields based on question type
          if (question.type === "multiple_choice") {
            questionData.options = question.options || {};
            questionData.correctAnswer = question.correctAnswer;
          } else {
            // For essay questions, keep options as empty object
            questionData.options = {};
            questionData.correctAnswer = question.sampleAnswer || ""; // Use sample answer as correct answer for essay
          }

          return questionData;
        });

        const refType = location.state?.refType || (examId ? "Exam" : "Lesson");
        const dataToSend = {
          refType: refType,
          refId: examId || lessonId || location.state?.refId,
          questions: questionsToCreate,
        };

        // Add textPassage if available (for reading comprehension questions)
        if (formData.textPassage && formData.textPassage.trim()) {
          dataToSend.textPassage = formData.textPassage.trim();
        }

        // Add level only for lessons
        if (refType === "Lesson" && location.state?.level) {
          dataToSend.level = location.state.level;
        }

        console.log("Navigation state:", location.state);
        console.log("Params - examId:", examId, "lessonId:", lessonId);
        console.log("Sending to API:", dataToSend);

        await createMultipleQuestions(dataToSend);
        toast.success(`Thêm thành công ${questionsArray.length} câu hỏi!`);
      }

      // Navigate back based on source
      if (location.state?.source === "ontap") {
        navigate("/admin/ontap", {
          state: {
            showQuestions: true,
            lessonId: location.state?.lessonId || location.state?.refId,
            lessonTitle: location.state?.lessonTitle,
          },
        });
      } else {
        // Navigate back to Tests page with questions view
        navigate("/admin/bai-kiem-tra", {
          state: {
            showQuestions: true,
            examId: examId,
          },
        });
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu câu hỏi";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if coming from Ontap page
    if (location.state?.source === "ontap") {
      navigate("/admin/ontap", {
        state: {
          showQuestions: true,
          lessonId: location.state?.lessonId || location.state?.refId,
          lessonTitle: location.state?.lessonTitle,
        },
      });
    } else {
      navigate("/admin/bai-kiem-tra", {
        state: {
          showQuestions: true,
          examId: examId,
        },
      });
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ContentWrapper>
          <Header>
            <Title>
              <span className="icon">📝</span>
              <span className="text">
                {mode === "add" ? "Thêm Câu Hỏi Mới" : "Chỉnh Sửa Câu Hỏi"}
              </span>
            </Title>
            <BackButton onClick={handleBack}>← Quay lại</BackButton>
          </Header>

          <FormContainer>
            <DynamicQuestionsForm
              ref={formRef}
              initialData={initialData}
              initialTextPassage={initialTextPassage}
              onSubmit={handleSubmit}
              mode={mode}
            />

            <ActionButtons>
              <CancelButton onClick={handleCancel} disabled={isLoading}>
                Hủy bỏ
              </CancelButton>
              <SubmitButton
                onClick={() => {
                  // Trigger form submission
                  if (formRef.current?.submitForm) {
                    formRef.current.submitForm();
                  }
                }}
                disabled={isLoading}
              >
                {isLoading
                  ? "Đang xử lý..."
                  : mode === "add"
                  ? "Thêm câu hỏi"
                  : "Cập nhật"}
              </SubmitButton>
            </ActionButtons>
          </FormContainer>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default AddQuestionsPage;
