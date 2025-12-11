// src/hooks/useStudent.js
import { useState, useEffect } from "react";
import { getMyStudents, addMyStudent } from "../services/apiService";

export default function useStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(
    JSON.parse(localStorage.getItem("selectedStudent")) || null
  );

  // === Lấy danh sách học sinh ===
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getMyStudents();
      setStudents(res.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải học sinh");
    } finally {
      setLoading(false);
    }
  };

  // === Tạo mới học sinh ===
  const createStudent = async (studentData) => {
    try {
      const formData = new FormData();
      formData.append("name", studentData.name);
      formData.append("class", studentData.class);
      formData.append("dateofBirth", studentData.dateofBirth);
      if (studentData.avatar) formData.append("avatar", studentData.avatar);

      const res = await addMyStudent(formData);
      setStudents((prev) => [...prev, res.data.data]);
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Thêm học sinh thất bại");
    }
  };

  // === Chọn học sinh ===
  const selectStudent = (student) => {
    setSelectedStudent(student);
    localStorage.setItem("studentId", student._id);
    localStorage.setItem("selectedStudent", JSON.stringify(student));
  };

  // === Load khi mount ===
  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Tự động chọn học sinh nếu chỉ có 1 học sinh
  useEffect(() => {
    if (students.length === 1) {
      const student = students[0];
      setSelectedStudent(student);
      localStorage.setItem("studentId", student._id);
      localStorage.setItem("selectedStudent", JSON.stringify(student));

      // Chuyển vào trang chính
      window.location.href = "/";
    }
  }, [students]);

  return {
    students,
    loading,
    error,
    selectedStudent,
    fetchStudents,
    createStudent,
    selectStudent,
  };
}
