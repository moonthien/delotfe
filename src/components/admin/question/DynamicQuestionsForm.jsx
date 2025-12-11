import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionCard = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #f9fafb;
  position: relative;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const QuestionTitle = styled.h3`
  color: #374151;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }
`;

const AddButton = styled.button`
  background: #00d4aa;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    background: #00b894;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const GlobalFormSection = styled.div`
  background: #e0f2fe;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const GlobalSectionTitle = styled.h3`
  color: #0369a1;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
`;

const DynamicQuestionsForm = forwardRef(
  (
    { onSubmit, initialData = [], initialTextPassage = "", mode = "add" },
    ref
  ) => {
    // Initialize global form state (only textPassage)
    const [textPassage, setTextPassage] = useState(initialTextPassage);

    // Initialize with one question or use provided initial data
    const [questions, setQuestions] = useState(() => {
      if (initialData && initialData.length > 0) {
        return initialData;
      }
      return [
        {
          question: "",
          questionType: "multiple_choice", // Each question has its own type
          isReadingQuestion: false, // Each question has its own reading question flag
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          sampleAnswer: "",
          explanation: "", // Thêm trường explanation
        },
      ];
    });

    const [errors, setErrors] = useState({});

    // Update questions when initialData changes
    useEffect(() => {
      if (initialData && initialData.length > 0) {
        // Process initialData to ensure isReadingQuestion is included
        const processedData = initialData.map((question) => ({
          question: question.question || "",
          questionType: question.questionType || "multiple_choice",
          isReadingQuestion: question.isReadingQuestion || false, // Ensure isReadingQuestion is included
          optionA: question.optionA || "",
          optionB: question.optionB || "",
          optionC: question.optionC || "",
          optionD: question.optionD || "",
          correctAnswer: question.correctAnswer || "",
          sampleAnswer: question.sampleAnswer || "",
          explanation: question.explanation || "", // Thêm trường explanation
        }));
        setQuestions(processedData);
      }
    }, [initialData]);

    // Update textPassage when initialTextPassage changes
    useEffect(() => {
      setTextPassage(initialTextPassage);
    }, [initialTextPassage]);

    const addQuestion = () => {
      setQuestions([
        ...questions,
        {
          question: "",
          questionType: "multiple_choice", // Each new question defaults to multiple choice
          isReadingQuestion: false, // Each new question defaults to not reading question
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "",
          sampleAnswer: "",
          explanation: "", // Thêm trường explanation
        },
      ]);
    };

    const removeQuestion = (index) => {
      if (questions.length > 1) {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);

        // Clean up errors for removed question
        const newErrors = { ...errors };
        delete newErrors[index];
        setErrors(newErrors);
      }
    };

    const updateQuestion = (index, field, value) => {
      const newQuestions = [...questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      setQuestions(newQuestions);

      // Clear error for this field
      if (errors[index] && errors[index][field]) {
        const newErrors = { ...errors };
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
        setErrors(newErrors);
      }
    };

    const validateQuestions = () => {
      const newErrors = {};
      let hasErrors = false;

      // Check if any question is a reading question
      const hasReadingQuestions = questions.some((q) => q.isReadingQuestion);

      // Validate textPassage only if:
      // 1. There are reading questions
      // 2. AND no existing textPassage from API
      // 3. AND in add mode (not edit mode)
      // 4. AND current textPassage is empty
      if (
        hasReadingQuestions &&
        !initialTextPassage &&
        mode === "add" &&
        (!textPassage || textPassage.trim() === "")
      ) {
        newErrors.textPassage = "Đoạn văn là bắt buộc khi có câu hỏi đọc hiểu";
        hasErrors = true;
      }

      questions.forEach((question, index) => {
        const questionErrors = {};

        if (!question.question || question.question.trim() === "") {
          questionErrors.question = "Câu hỏi là bắt buộc";
          hasErrors = true;
        } else if (question.question.length < 10) {
          questionErrors.question = "Câu hỏi phải có ít nhất 10 ký tự";
          hasErrors = true;
        }

        // Validate based on question type
        if (question.questionType === "multiple_choice") {
          if (!question.optionA || question.optionA.trim() === "") {
            questionErrors.optionA = "Đáp án A là bắt buộc";
            hasErrors = true;
          }

          if (!question.optionB || question.optionB.trim() === "") {
            questionErrors.optionB = "Đáp án B là bắt buộc";
            hasErrors = true;
          }

          if (!question.optionC || question.optionC.trim() === "") {
            questionErrors.optionC = "Đáp án C là bắt buộc";
            hasErrors = true;
          }

          if (!question.optionD || question.optionD.trim() === "") {
            questionErrors.optionD = "Đáp án D là bắt buộc";
            hasErrors = true;
          }

          if (!question.correctAnswer || question.correctAnswer.trim() === "") {
            questionErrors.correctAnswer = "Đáp án đúng là bắt buộc";
            hasErrors = true;
          }
        }

        if (Object.keys(questionErrors).length > 0) {
          newErrors[index] = questionErrors;
        }
      });

      setErrors(newErrors);
      return !hasErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validateQuestions()) {
        // Transform data to API format
        const formattedQuestions = questions.map((question) => {
          const baseQuestion = {
            question: question.question,
            isReadingQuestion: question.isReadingQuestion || false,
            explanation: question.explanation || "", // Thêm explanation vào base question
          };

          if (question.questionType === "multiple_choice") {
            return {
              ...baseQuestion,
              type: "multiple_choice",
              options: {
                A: question.optionA,
                B: question.optionB,
                C: question.optionC,
                D: question.optionD,
              },
              correctAnswer: question.correctAnswer,
            };
          } else {
            return {
              ...baseQuestion,
              type: "essay",
              sampleAnswer: question.sampleAnswer || "",
            };
          }
        });

        const hasReadingQuestions = questions.some((q) => q.isReadingQuestion);
        const dataToSubmit = {
          questions: formattedQuestions,
          // Use existing textPassage from API or new textPassage from form
          textPassage: hasReadingQuestions
            ? initialTextPassage || textPassage
            : "",
        };
        onSubmit(dataToSubmit);
      }
    };

    // Expose submit function to parent component
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        if (validateQuestions()) {
          // Transform data to API format
          const formattedQuestions = questions.map((question) => {
            const baseQuestion = {
              question: question.question,
              isReadingQuestion: question.isReadingQuestion || false,
              explanation: question.explanation || "", // Thêm explanation vào base question
            };

            if (question.questionType === "multiple_choice") {
              return {
                ...baseQuestion,
                type: "multiple_choice",
                options: {
                  A: question.optionA,
                  B: question.optionB,
                  C: question.optionC,
                  D: question.optionD,
                },
                correctAnswer: question.correctAnswer,
              };
            } else {
              return {
                ...baseQuestion,
                correctAnswer: question.correctAnswer,
                type: "essay",
                sampleAnswer: question.sampleAnswer || "",
              };
            }
          });

          const hasReadingQuestions = questions.some(
            (q) => q.isReadingQuestion
          );
          const dataToSubmit = {
            questions: formattedQuestions,
            // Use existing textPassage from API or new textPassage from form
            textPassage: hasReadingQuestions
              ? initialTextPassage || textPassage
              : "",
          };
          onSubmit(dataToSubmit);
        }
      },
    }));

    const renderQuestionForm = (question, index) => (
      <QuestionCard key={index}>
        <QuestionHeader>
          <QuestionTitle>Câu hỏi {index + 1}</QuestionTitle>
          {questions.length > 1 && (
            <RemoveButton onClick={() => removeQuestion(index)}>
              Xóa câu này
            </RemoveButton>
          )}
        </QuestionHeader>

        <FormGroup>
          <Label>Câu hỏi</Label>
          <TextArea
            value={question.question}
            onChange={(e) => updateQuestion(index, "question", e.target.value)}
            placeholder="Nhập nội dung câu hỏi..."
          />
          {errors[index]?.question && (
            <ErrorText>{errors[index].question}</ErrorText>
          )}
        </FormGroup>

        {/* Question Type Selector for each question */}
        <FormGroup>
          <Label>Loại câu hỏi</Label>
          <Select
            value={question.questionType}
            onChange={(e) =>
              updateQuestion(index, "questionType", e.target.value)
            }
          >
            <option value="multiple_choice">Trắc nghiệm</option>
            <option value="essay">Tự luận</option>
          </Select>
        </FormGroup>

        {/* Reading Question Checkbox for each question */}
        <FormGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={question.isReadingQuestion || false}
              onChange={(e) =>
                updateQuestion(index, "isReadingQuestion", e.target.checked)
              }
            />
            Đây là câu hỏi đọc hiểu
          </CheckboxLabel>
        </FormGroup>

        {/* Conditional rendering based on question type */}
        {question.questionType === "multiple_choice" ? (
          <>
            <FormGroup>
              <Label>Đáp án A</Label>
              <Input
                value={question.optionA}
                onChange={(e) =>
                  updateQuestion(index, "optionA", e.target.value)
                }
                placeholder="Nhập đáp án A..."
              />
              {errors[index]?.optionA && (
                <ErrorText>{errors[index].optionA}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Đáp án B</Label>
              <Input
                value={question.optionB}
                onChange={(e) =>
                  updateQuestion(index, "optionB", e.target.value)
                }
                placeholder="Nhập đáp án B..."
              />
              {errors[index]?.optionB && (
                <ErrorText>{errors[index].optionB}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Đáp án C</Label>
              <Input
                value={question.optionC}
                onChange={(e) =>
                  updateQuestion(index, "optionC", e.target.value)
                }
                placeholder="Nhập đáp án C..."
              />
              {errors[index]?.optionC && (
                <ErrorText>{errors[index].optionC}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Đáp án D</Label>
              <Input
                value={question.optionD}
                onChange={(e) =>
                  updateQuestion(index, "optionD", e.target.value)
                }
                placeholder="Nhập đáp án D..."
              />
              {errors[index]?.optionD && (
                <ErrorText>{errors[index].optionD}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Đáp án đúng</Label>
              <Select
                value={question.correctAnswer}
                onChange={(e) =>
                  updateQuestion(index, "correctAnswer", e.target.value)
                }
              >
                <option value="">Chọn đáp án đúng...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Select>
              {errors[index]?.correctAnswer && (
                <ErrorText>{errors[index].correctAnswer}</ErrorText>
              )}
            </FormGroup>
          </>
        ) : (
          <FormGroup>
            <Label>Gợi ý đáp án (tùy chọn)</Label>
            <TextArea
              value={question.sampleAnswer}
              onChange={(e) =>
                updateQuestion(index, "sampleAnswer", e.target.value)
              }
              placeholder="Nhập gợi ý đáp án cho câu tự luận..."
              style={{ minHeight: "80px" }}
            />
          </FormGroup>
        )}

        {/* Explanation field - available for all question types */}
        <FormGroup>
          <Label>Giải thích đáp án (tùy chọn)</Label>
          <TextArea
            value={question.explanation}
            onChange={(e) =>
              updateQuestion(index, "explanation", e.target.value)
            }
            placeholder="Nhập giải thích chi tiết cho đáp án..."
            style={{ minHeight: "80px" }}
          />
        </FormGroup>
      </QuestionCard>
    );

    return (
      <form onSubmit={handleSubmit}>
        <Container>
          {/* Global form fields - Show textPassage section only if:
              1. Any question is reading question
              2. AND no existing textPassage from API 
              3. AND in add mode (not edit mode) */}
          {questions.some((q) => q.isReadingQuestion) &&
            !initialTextPassage &&
            mode === "add" && (
              <GlobalFormSection>
                <GlobalSectionTitle>📖 Đoạn văn đọc hiểu</GlobalSectionTitle>

                <FormGroup>
                  <Label>Đoạn văn đọc hiểu</Label>
                  <TextArea
                    value={textPassage}
                    onChange={(e) => {
                      setTextPassage(e.target.value);
                      // Clear error if user starts typing
                      if (errors.textPassage) {
                        const newErrors = { ...errors };
                        delete newErrors.textPassage;
                        setErrors(newErrors);
                      }
                    }}
                    placeholder="Nhập đoạn văn để học sinh đọc hiểu..."
                    rows={5}
                  />
                  {errors.textPassage && (
                    <ErrorText>{errors.textPassage}</ErrorText>
                  )}
                </FormGroup>
              </GlobalFormSection>
            )}

          {questions.map((question, index) =>
            renderQuestionForm(question, index)
          )}

          {mode === "add" && (
            <AddButton type="button" onClick={addQuestion}>
              + Thêm câu hỏi tiếp theo
            </AddButton>
          )}
        </Container>
      </form>
    );
  }
);

export default DynamicQuestionsForm;
