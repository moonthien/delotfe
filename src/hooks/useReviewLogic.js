import { useEffect, useState } from "react";
import { getLessonReviews, createLessonReview, getLessonReviewStats } from "../services/apiService";

export const useReviewLogic = (lessonId) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!lessonId) return;
    try {
      const res = await getLessonReviews(lessonId);
      setReviews(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi load review:", err);
    }
  };

  const fetchStats = async () => {
    if (!lessonId) return;
    try {
      const res = await getLessonReviewStats(lessonId);
      setStats(res.data.data);
    } catch (err) {
      console.error("❌ Lỗi khi load thống kê:", err);
    }
  };

  const handleSubmitReview = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId || !lessonId) return alert("Thiếu thông tin học sinh hoặc bài học!");

    const data = { lessonId, studentId, rating, comment: newComment };
    setLoading(true);
    try {
      await createLessonReview(data);
      setNewComment("");
      setRating(5);
      await fetchReviews();
      await fetchStats();
    } catch (err) {
      alert(err.response?.data?.error || "Không thể gửi bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [lessonId]);

  return {
    reviews,
    stats,
    rating,
    setRating,
    newComment,
    setNewComment,
    loading,
    handleSubmitReview,
  };
};
