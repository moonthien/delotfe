import { useState, useEffect, useRef, useCallback } from "react";
import { saveAnswerProgress } from "../services/apiService";

export const useTimer = ({
  activeLesson,
  activeExam,
  selectedLevel,
  questions,
  handleFinish,
  handleFinishExam,
}) => {
  const [timeLeft, setTimeLeft] = useState(activeLesson ? 0 : 2400);
  const timerRef = useRef(null);
  
  // ✅ Dùng useRef để tránh re-render khi dependencies thay đổi
  const handleFinishExamRef = useRef(handleFinishExam);
  const handleFinishRef = useRef(handleFinish);
  
  useEffect(() => {
    handleFinishExamRef.current = handleFinishExam;
    handleFinishRef.current = handleFinish;
  }, [handleFinishExam, handleFinish]);

  // 🕒 Bộ đếm thời gian
  useEffect(() => {
    if (activeExam || activeLesson) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (activeLesson) {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(interval);
              window.__examTimerRef = null;
              timerRef.current = null;

              if (!window.__examHasSubmitted) {
                handleFinishExamRef.current?.();
              }
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);

      window.__examTimerRef = interval;
      timerRef.current = interval;

      return () => clearInterval(interval);
    }
  }, [activeLesson, activeExam]); // ✅ Bỏ handleFinish, handleFinishExam

  // 💾 Auto-save
  useEffect(() => {
    if (!(activeLesson || activeExam)) return;

    const interval = setInterval(async () => {
      const studentId = localStorage.getItem("studentId");
      const token = localStorage.getItem("accessToken");
      if (!studentId || !token) return;

      const refType = activeLesson ? "Lesson" : "Exam";
      const refId = activeLesson || activeExam;
      const level = selectedLevel || "";
      const storageKey = refType === "Lesson" ? "lessonTimeLeft" : "examTimeLeft";

      setTimeLeft((prev) => {
        const currentTimeLeft = prev;
        localStorage.setItem(storageKey, currentTimeLeft.toString());

        const timeSpent = activeLesson ? currentTimeLeft : 2400 - currentTimeLeft;

        saveAnswerProgress(studentId, {
          refType,
          refId,
          level,
          timeSpent,
          status: "in_progress",
        }).catch(() => {});
        return currentTimeLeft;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeLesson, activeExam, selectedLevel]);

  // 🔄 Reset
  // useEffect(() => {
  //   if (activeLesson) setTimeLeft(0);
  //   if (activeExam) setTimeLeft(2400);
  // }, [activeLesson, activeExam]);

  return { timeLeft, setTimeLeft };
};