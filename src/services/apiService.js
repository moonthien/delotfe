import API from "./api";

/**
 * USER API
 */
export const getUsers = (params = {}) =>
  API.get("/users", { params: { limit: 100, ...params } });

export const createUsers = (userData) => API.post("/users", userData);

export const updateUsers = (id, userData) => API.put(`/users/${id}`, userData);

export const deleteUsers = (id) => API.delete(`/users/${id}/permanent`);

/**
 * AUTH API
 */
export const loginUser = (usernameOrEmail, password) =>
  API.post("/auth/login", { usernameOrEmail, password });

export const registerUser = (userData) => API.post("/auth/register", userData);

export const sendOtpFull = (username, email, purpose = "verify") =>
  API.post("/auth/sendOtp", { username, email, purpose });

export const sendOtp = (username, purpose = "verify") =>
  API.post("/auth/sendOtp", { username, purpose });

export const verifyOtp = (username, otpCode) =>
  API.post("/auth/verifyOTP", { username, otpCode });

export const forgotPassword = (username, otpCode, email) =>
  API.post("/auth/forgotPassword", { username, otpCode, email });

export const changePasswordWithOtp = (email, otpCode, newPassword) =>
  API.post("/auth/change-password-otp", { email, otpCode, newPassword });

export const changePasswordWithOtpAndOld = (
  username,
  email,
  oldPassword,
  newPassword,
  otpCode
) =>
  API.post("/auth/change-password-otp-old", {
    username,
    email,
    oldPassword,
    newPassword,
    otpCode,
  });

/**
 * STUDENT API
 */
export const addMyStudent = (formData) => {
  const token = localStorage.getItem("accessToken");
  return API.post("/students/add-my", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateMyStudent = (id, formData) =>
  API.put(`/students/${id}`, formData);

export const deleteMyStudent = (id) => API.delete(`/students/${id}`);

export const getAllStudents = (page = 1, limit = 10) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/students?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getStudentById = (id) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStudent = (id, data) => {
  const token = localStorage.getItem("accessToken");
  return API.put(`/students/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyStudents = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Access token is missing");
  }

  return API.get("/students/my", {
    params: { limit: 100, ...params },
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * SUBJECT API
 */
export const getAllSubjects = (params = {}) =>
  API.get("/subjects", { params: { limit: 1000, ...params } });

export const getSubjectsByGrade = (grade) =>
  API.get(`/subjects/grade/${grade}`);

export const createSubject = (subjectData) =>
  API.post("/subjects", subjectData);

export const updateSubject = (id, subjectData) =>
  API.put(`/subjects/${id}`, subjectData);

export const deleteSubject = (id) => API.delete(`/subjects/${id}`);

/**
 * TOPIC API
 */
export const getTopicsBySubject = (subjectId) =>
  API.get(`/topics/subject/${subjectId}`);

export const getAllTopics = (params = {}) =>
  API.get("/topics", { params: { limit: 1000, ...params } });

export const createTopic = (topicData) => API.post("/topics", topicData);

export const updateTopic = (id, topicData) =>
  API.put(`/topics/${id}`, topicData);

export const deleteTopic = (id) => API.delete(`/topics/${id}`);

export const thongkeTopics = () => API.get("/topics/stats");

/**
 * LESSON API
 */
export const getLessonsByTopic = (topicId) =>
  API.get(`/lessons/topic/${topicId}`);

export const getAllLessons = (params = {}) =>
  API.get("/lessons", { params: { limit: 1000, ...params } });

export const createLesson = (lessonData) => API.post("/lessons", lessonData);

export const updateLesson = (id, lessonData) =>
  API.put(`/lessons/${id}`, lessonData);

export const deleteLesson = (id) => API.delete(`/lessons/${id}`);

export const thongkeLessons = () => API.get("/lessons/stats");

/**
 * QUESTION API
 */
export const getQuestionSet = (lessonId, level) =>
  API.get(`/questions/lesson/${lessonId}/level/${level}`);

export const getQuestionSetsByLesson = (lessonId) => {
  return API.get(`/questions/lesson/${lessonId}`);
};

export const checkAnswer = (questionId, userAnswer) => {
  return API.post(`/questions/${questionId}/check-answer`, {
    questionId,
    userAnswer,
  });
};

export const getAllQuestionSetsByLesson = () => {
  return API.get(`/lessons/lessons-with-questions`);
};

export const getQuestionsByExam = (examId) => {
  return API.get(`/questions/exam/${examId}`);
};

export const createQuestion = (questionData) => {
  return API.post("/questions", questionData);
};

export const createMultipleQuestions = (questionsData) => {
  return API.post("/questions", questionsData);
};

export const updateQuestionById = (id, questionId, questionData) => {
  return API.put(`/questions/${id}/questions/${questionId}`, questionData);
};

export const updateQuestionByTextpassgae = (id, questionData) => {
  return API.put(`/questions/${id}`, questionData);
};

export const getQuestionById = (id, questionId) => {
  return API.get(`/questions/${id}/questions/${questionId}`);
};

export const deleteQuestionById = (id, questionId) => {
  return API.delete(`/questions/${id}/questions/${questionId}`);
};

// xoá toàn bộ câu hỏi trong một bộ câu hỏi
export const deleteAllQuestionsInSet = (id) => {
  return API.delete(`/questions/${id}`);
};

export const thongKeQuestions = () => API.get("/questions/stats/overall");

/**
 * EXAM API
 */
export const getExamsBySubject = (subjectId) =>
  API.get(`/exams/subject/${subjectId}`);

export const getAllExams = (params = {}) =>
  API.get("/exams", { params: { limit: 100, ...params } });

export const createExam = (examData) => {
  return API.post("/exams", examData);
};

export const updateExam = (id, examData) => {
  return API.put(`/exams/${id}`, examData);
};

export const deleteExam = (id) => API.delete(`/exams/${id}`);

/**
 * RESULT API
 */
export const submitExamResult = (studentId, examId, answers, timeSpent) => {
  const token = localStorage.getItem("accessToken");
  return API.post(
    "/results/submit-exam",
    { studentId, examId, answers, timeSpent },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const submitLessonResult = (
  studentId,
  lessonId,
  answers,
  timeSpent,
  level
) => {
  const token = localStorage.getItem("accessToken");
  return API.post(
    "/results/submit-lesson",
    { studentId, lessonId, answers, timeSpent, level, refType: "Lesson" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// export const getResultsByStudent = (studentId) =>
//   API.get(`/results/student/${studentId}`);
export const getResultsByStudent = (studentId, refType = "") => {
  const token = localStorage.getItem("accessToken");
  const params = refType ? { refType } : {};
  return API.get(`/results/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
};

export const getLeaderboardBySubject = (subjectId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/results/leaderboard/subject/${subjectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * PROGRESS API
 */
export const getLessonProgress = (lessonId, studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/progresses/lesson/${lessonId}/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// export const getExamProgress = (examId, studentId) => {
//   const token = localStorage.getItem("accessToken");
//   return API.get(`/progresses/exam/${examId}/student/${studentId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
export const getExamProgress = (examId, studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/progresses/exam/${examId}/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveAnswerProgress = (studentId, data) => {
  const token = localStorage.getItem("accessToken");
  return API.post(`/progresses/save-answer/${studentId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// export const getCurrentQuestion = (studentId, refType, refId, level) => {
//   const token = localStorage.getItem("accessToken");
//   return API.get(
//     `/progresses/current/${studentId}/${refType}/${refId}/${level}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };
export const getCurrentQuestion = (studentId, refType, refId, level = "") => {
  const token = localStorage.getItem("accessToken");
  const url =
    refType === "Lesson"
      ? `/progresses/current/${studentId}/${refType}/${refId}/${level}`
      : `/progresses/current/${studentId}/${refType}/${refId}`;
  return API.get(url, { headers: { Authorization: `Bearer ${token}` } });
};

export const checkProgress = (studentId, refType, refId, level) =>
  API.get(`/progresses/check/${studentId}/${refType}/${refId}/${level}`);

// export const resetProgress = (studentId, refType, refId, level) => {
//   const token = localStorage.getItem("accessToken");
//   return API.delete(
//     `/progresses/reset/${studentId}/${refType}/${refId}/${level}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };
export const resetProgress = (studentId, refType, refId, level) => {
  const token = localStorage.getItem("accessToken");
  return API.post(
    `/progresses/reset`,
    { studentId, refType, refId, level },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

/**
 * UPLOAD IMAGE
 */
export const uploadImageStudent = (formData) => {
  const token = localStorage.getItem("accessToken");
  return API.post("/images/upload/student", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Badge API
 */
export const getAllBadges = (params = {}) => {
  return API.get("/badges", { params: { limit: 100, ...params } });
};

export const getBadgesByStudent = (studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/students/${studentId}/badges`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createBadge = (badgeData) => API.post("/badges", badgeData);

export const updateBadge = (id, badgeData) =>
  API.put(`/badges/${id}`, badgeData);

export const deleteBadge = (id) => API.delete(`/badges/${id}`);

/**
 * AI Practice API
 */
// 1️⃣ Tạo đề ôn tập AI cho lesson
// POST /practice/generate
export const generatePractice = async (lessonId, level = "de") => {
  try {
    // Fallback lessonId mặc định để test
    const finalLessonId = lessonId || "689ab7af3f4fc490a4bad12b";
    const token = localStorage.getItem("accessToken");

    const res = await API.post(
      "/practice/generate",
      { lessonId: finalLessonId, level },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res;
  } catch (error) {
    console.error("Lỗi generatePractice:", error);
    throw error;
  }
};

// 2️⃣ Lấy danh sách câu hỏi từ một practiceSessionId
// GET /practice/:practiceSessionId
export const getPracticeById = async (practiceSessionId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await API.get(`/practice/${practiceSessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (error) {
    console.error("Lỗi getPracticeById:", error);
    throw error;
  }
};

// 3️⃣ Nộp kết quả bài ôn tập AI
// POST /practice/submit
export const submitPracticeResult = async (
  practiceSessionId,
  answers,
  studentId,
  timeSpent
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await API.post(
      "/practice/submit",
      { practiceSessionId, studentId, answers, timeSpent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res;
  } catch (error) {
    console.error("Lỗi submitPracticeResult:", error);
    throw error;
  }
};

// Tạo đề luyện tập AI cho EXAM
// POST /v1/api/practice/generate-exam
export const generateExamPractice = async (examId, count = 10) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await API.post(
      "/practice/generate-exam",
      { examId, count },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res;
  } catch (error) {
    console.error("❌ Lỗi generateExamPractice:", error);
    throw error;
  }
};

/**
 * REWARD API
 */
export const getAllRewardsAdmin = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return API.get("/rewards/admin", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getActiveRewards = (params = {}) =>
  API.get("/rewards", { params });

export const getAvailableRewards = (studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/rewards/student/${studentId}/available`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const exchangeReward = (rewardId, studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.post(
    `/rewards/exchange/${rewardId}`,
    { studentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getExchangedRewards = (studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/rewards/student/${studentId}/exchanged`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//tree decoration APIs
export const addTreeDecoration = (studentId, data) => {
  const token = localStorage.getItem("accessToken");
  return API.post(`/tree/${studentId}/decorations`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTreeByStudentId = (studentId) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/tree/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const removeTreeDecoration = (studentId, decorationId, layout) => {
  const token = localStorage.getItem("accessToken");
  return API.delete(
    `/tree/${studentId}/decorations/${decorationId}?layout=${layout}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
export const clearAllTreeDecorations = (studentId, layout) => {
  const token = localStorage.getItem("accessToken");
  const url = layout
    ? `/tree/${studentId}/decorations?layout=${layout}`
    : `/tree/${studentId}/decorations`;
  return API.delete(url, { headers: { Authorization: `Bearer ${token}` } });
};
export const updateTreeLayout = (studentId, layout) => {
  const token = localStorage.getItem("accessToken");
  return API.put(
    `/tree/${studentId}/layout`,
    { treeLayout: layout },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
export const getTreeDecorationsByLayout = (studentId, layout) => {
  const token = localStorage.getItem("accessToken");
  return API.get(`/tree/${studentId}?layout=${layout}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//import questions via excelhttp://localhost:3999/v1/api/questions/import-excel
export const importQuestionsViaExcel = (formData) => {
  return API.post("/questions/import-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const exportQuestionsToExcel = () => {
  return API.get("/templates/download", {
    responseType: "blob", // Important: tell axios to expect binary data
  });
};

export const exportdataExcel = () => {
  return API.get(`/templates/backup/export`, {
    responseType: "blob", // Important: tell axios to expect binary data
  });
};

// ===================== REVIEWS =====================
export const getLessonReviews = (lessonId) => {
  return API.get(`/reviews/lesson/${lessonId}`);
};

export const createLessonReview = (data) => {
  return API.post(`/reviews`, data);
};

export const getLessonReviewStats = (lessonId) => {
  return API.get(`/reviews/lesson/${lessonId}/stats`);
};
