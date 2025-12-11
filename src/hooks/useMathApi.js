import { useState, useEffect } from "react";
import {
  getAllSubjects,
  getSubjectsByGrade,
  getTopicsBySubject,
  getLessonsByTopic,
  getQuestionSetsByLesson,
  getLessonProgress,
} from "../services/apiService";

export function useMathApi(selectedClass, selectedSubject, activeLesson, selectedLevel) {
  const [grades, setGrades] = useState([]);
  const [subjectsByGrade, setSubjectsByGrade] = useState([]);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  // Lấy danh sách lớp có môn Toán
  useEffect(() => {
    getAllSubjects()
      .then((res) => {
        const mathSubjects = res.data.data.filter((s) =>
          s.name.toLowerCase().includes("toán")
        );
        const uniqueGrades = [...new Set(mathSubjects.map((s) => s.grade))];
        setGrades(uniqueGrades);
      })
      .catch((err) => console.error("Lỗi lấy danh sách lớp:", err.response?.data || err.message));
  }, []);

  // Khi chọn lớp → lấy subjects
  useEffect(() => {
    if (selectedClass) {
      getSubjectsByGrade(selectedClass)
        .then((res) => {
          const mathSubs = res.data.data.filter((s) =>
            s.name.toLowerCase().includes("toán")
          );
          setSubjectsByGrade(mathSubs);
        })
        .catch((err) => console.error("Lỗi lấy subjects:", err.response?.data || err.message));
    } else {
      setSubjectsByGrade([]);
    }
    setTopics([]);
    setLessons([]);
    setQuestions([]);
    setProgressMap({});
  }, [selectedClass]);

  // Khi chọn tập → lấy topics
  useEffect(() => {
    if (selectedSubject) {
      getTopicsBySubject(selectedSubject)
        .then((res) => setTopics(res.data.data))
        .catch((err) => console.error("Lỗi lấy topics:", err.response?.data || err.message));
    } else {
      setTopics([]);
    }
    setLessons([]);
    setQuestions([]);
    setProgressMap({});
  }, [selectedSubject]);

  // Khi chọn lesson + level → lấy questions
  useEffect(() => {
    if (activeLesson && selectedLevel) {
      getQuestionSetsByLesson(activeLesson)
        .then((res) => {
          if (res.data.data.length > 0) {
            const filteredSets = res.data.data.filter(
              (qs) => qs.level === selectedLevel
            );
            const allQuestions = filteredSets.flatMap((qs) => qs.questions);
            setQuestions(allQuestions);
          } else {
            setQuestions([]);
          }
        })
        .catch((err) => console.error("Lỗi lấy question sets:", err.response?.data || err.message));
    }
  }, [activeLesson, selectedLevel]);

  // Khi chọn lesson + level → lấy tiến độ
  useEffect(() => {
    if (activeLesson && selectedLevel) {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        console.warn("⚠️ Chưa có studentId → bỏ qua load tiến độ");
        return;
      }
      getLessonProgress(activeLesson, studentId)
        .then((res) => {
          const percent = res.data.data.percent || 0;
          setProgressMap((prev) => ({
            ...prev,
            [activeLesson]: percent / 100,
          }));
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            console.warn("⚠️ Chưa có progress → đặt 0%");
            setProgressMap((prev) => ({
              ...prev,
              [activeLesson]: 0,
            }));
          } else {
            console.error("Lỗi load tiến độ:", err.response?.data || err.message);
            setProgressMap((prev) => ({
              ...prev,
              [activeLesson]: 0,
            }));
          }
        });
    }
  }, [activeLesson, selectedLevel]);

  // Click topic → load lessons + fetch progress cho từng lesson
  const fetchLessonsByTopic = (topicId) => {
    const studentId = localStorage.getItem("studentId");
    console.log("studentId:", studentId);

    getLessonsByTopic(topicId)
      .then(async (res) => {
        const lessonsData = res.data.data;
        console.log("lessonsData:", lessonsData);
        setLessons(lessonsData);

        if (studentId) {
          const progresses = {};
          const progressPromises = lessonsData.map(lesson =>
            getLessonProgress(lesson._id, studentId)
              .then(resProg => ({
                lessonId: lesson._id,
                percent: (resProg.data.data.percent || 0) / 100,
              }))
              .catch(err => {
                console.error(`Lỗi khi lấy progress cho lesson ${lesson._id}:`, err.response?.data || err.message);
                return { lessonId: lesson._id, percent: 0 };
              })
          );

          const progressResults = await Promise.all(progressPromises);
          progressResults.forEach(({ lessonId, percent }) => {
            progresses[lessonId] = percent;
          });
          setProgressMap(progresses);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy lessons:", err.response?.data || err.message));
  };

  return {
    grades,
    subjectsByGrade,
    topics,
    lessons,
    setLessons,
    questions,
    setQuestions,
    fetchLessonsByTopic,
    progressMap,
  };
}