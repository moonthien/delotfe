// src/pages/admin/Lessons.jsx
import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  getAllLessons,
  getAllSubjects,
  getAllTopics,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../services/apiService";
import GenericTable from "../../components/admin/GenericTable";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import { lessonsTableConfig } from "../../components/admin/tableConfigs";
import LessonFormModal from "../../components/admin/lesson/LessonFormModal";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; overflow: hidden; font-family: 'Montserrat', sans-serif; }
  #root { width: 100%; height: 100%; }
`;

const Wrapper = styled.div`
  overflow: hidden;
  margin: 24px 2%;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  .icon {
    font-size: 32px;
  }

  .text {
    background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 50%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 44px;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 100%);
    border-radius: 2px;
    opacity: 0.7;
  }
`;

const Lessons = () => {
  // State cho dữ liệu chính
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  // State cho filter
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, subjectsRes, topicsRes] = await Promise.all([
          getAllLessons(),
          getAllSubjects(),
          getAllTopics(),
        ]);

        // Sort lessons by grade (ascending)
        const sortedLessons = (lessonsRes.data.data || []).sort(
          (a, b) =>
            (a.topicId?.subjectId?.grade || 0) -
            (b.topicId?.subjectId?.grade || 0)
        );
        setLessons(sortedLessons);
        setFilteredLessons(sortedLessons);

        // Set subjects and topics for modal form
        setSubjects(subjectsRes.data.data || []);
        setTopics(topicsRes.data.data || []);

        console.log("Fetched lessons:", lessonsRes.data.data);
        console.log("Fetched subjects:", subjectsRes.data.data);
        console.log("Fetched topics:", topicsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Get unique grades for filter options
  const uniqueGrades = [
    ...new Set(
      lessons.map((lesson) => lesson.topicId?.subjectId?.grade).filter(Boolean)
    ),
  ].sort((a, b) => a - b);

  // Get filtered subjects based on selected grade
  const getFilteredSubjects = () => {
    if (!selectedGrade) {
      return [
        ...new Set(
          lessons
            .map((lesson) => lesson.topicId?.subjectId?.name)
            .filter(Boolean)
        ),
      ].sort();
    } else {
      return [
        ...new Set(
          lessons
            .filter(
              (lesson) =>
                lesson.topicId?.subjectId?.grade?.toString() === selectedGrade
            )
            .map((lesson) => lesson.topicId?.subjectId?.name)
            .filter(Boolean)
        ),
      ].sort();
    }
  };

  // Get filtered topics based on selected grade and subject
  const getFilteredTopics = () => {
    let filtered = topics;

    if (selectedGrade) {
      filtered = filtered.filter(
        (topic) => topic.subjectId?.grade?.toString() === selectedGrade
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(
        (topic) => topic.subjectId?.name === selectedSubject
      );
    }

    return [
      ...new Set(filtered.map((topic) => topic.title).filter(Boolean)),
    ].sort();
  };

  const filteredSubjects = getFilteredSubjects();
  const filteredTopics = getFilteredTopics();

  // Get nested value for sorting - defined before use
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Filter lessons based on search term, grade, subject, and topic
  useEffect(() => {
    let filtered = lessons;

    if (search) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title?.toLowerCase().includes(search.toLowerCase()) ||
          lesson.topicId?.title?.toLowerCase().includes(search.toLowerCase()) ||
          lesson.topicId?.subjectId?.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.topicId?.subjectId?.grade?.toString() === selectedGrade
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(
        (lesson) => lesson.topicId?.subjectId?.name === selectedSubject
      );
    }

    if (selectedTopic) {
      filtered = filtered.filter(
        (lesson) => lesson.topicId?.title === selectedTopic
      );
    }

    setFilteredLessons(filtered);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Reset sorting when filter changes
    setSortField("");
    setSortDirection("asc");
  }, [lessons, search, selectedGrade, selectedSubject, selectedTopic]);

  // Sort filtered lessons
  const getSortedLessons = () => {
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
  };

  const sortedLessons = getSortedLessons();

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (selectedGrade) {
      const availableSubjects = getFilteredSubjects();
      if (selectedSubject && !availableSubjects.includes(selectedSubject)) {
        setSelectedSubject("");
        setSelectedTopic("");
      }
    }
  }, [selectedGrade]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedSubject) {
      const availableTopics = getFilteredTopics();
      if (selectedTopic && !availableTopics.includes(selectedTopic)) {
        setSelectedTopic("");
      }
    }
  }, [selectedSubject]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddLesson = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateLesson = async (lessonData) => {
    try {
      setIsLoading(true);

      console.log("Creating lesson with data:", lessonData);

      const response = await createLesson(lessonData);
      console.log("Lesson created successfully:", response.data);

      // Refresh lessons list
      const res = await getAllLessons();
      const sortedLessons = (res.data.data || []).sort(
        (a, b) =>
          (a.topicId?.subjectId?.grade || 0) -
          (b.topicId?.subjectId?.grade || 0)
      );
      setLessons(sortedLessons);
      setFilteredLessons(sortedLessons);

      setIsAddModalOpen(false);
      toast.success("Bài học đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating lesson:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo bài học";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLesson(null);
  };

  const handleUpdateLesson = async (lessonData) => {
    if (!selectedLesson) {
      console.error("No lesson selected for update");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Updating lesson:", selectedLesson._id, lessonData);

      const response = await updateLesson(selectedLesson._id, lessonData);
      console.log("Lesson updated successfully:", response.data);

      // Refresh lessons list
      const res = await getAllLessons();
      const sortedLessons = (res.data.data || []).sort(
        (a, b) =>
          (a.topicId?.subjectId?.grade || 0) -
          (b.topicId?.subjectId?.grade || 0)
      );
      setLessons(sortedLessons);
      setFilteredLessons(sortedLessons);

      setIsEditModalOpen(false);
      setSelectedLesson(null);
      toast.success("Bài học đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating lesson:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật bài học";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lesson) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteLesson(lesson._id);
      toast.success("Xóa bài học thành công!");

      // Refresh lessons list
      const res = await getAllLessons();
      const sortedLessons = (res.data.data || []).sort(
        (a, b) =>
          (a.topicId?.subjectId?.grade || 0) -
          (b.topicId?.subjectId?.grade || 0)
      );
      setLessons(sortedLessons);
      setFilteredLessons(sortedLessons);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Có lỗi xảy ra khi xóa bài học");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedTopic("");
    // Reset sorting when clearing filters
    setSortField("");
    setSortDirection("asc");
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new field, set it as sort field with ascending order
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">📖</span>
          <span className="text">Quản lý Bài học</span>
        </PageTitle>

        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm bài học",
            placeholder: "Nhập tên bài học, chủ đề, môn học...",
            value: search,
            onChange: setSearch,
          }}
          filterConfigs={[
            {
              label: "Lớp",
              value: selectedGrade,
              onChange: setSelectedGrade,
              placeholder: "Tất cả lớp",
              options: uniqueGrades.map((grade) => ({
                value: grade.toString(),
                label: `Lớp ${grade}`,
              })),
            },
            {
              label: "Môn học",
              value: selectedSubject,
              onChange: setSelectedSubject,
              placeholder: "Tất cả môn học",
              options: filteredSubjects.map((subject) => ({
                value: subject,
                label: subject,
              })),
            },
            {
              label: "Chủ đề",
              value: selectedTopic,
              onChange: setSelectedTopic,
              placeholder: "Tất cả chủ đề",
              options: filteredTopics.map((topic) => ({
                value: topic,
                label: topic,
              })),
            },
          ]}
          addButtonConfig={{
            text: "Thêm bài học",
            icon: "📖",
            onClick: handleAddLesson,
          }}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={lessonsTableConfig.columns}
          data={sortedLessons.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          actions={[
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEditLesson,
              title: "Chỉnh sửa",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDeleteLesson,
              title: "Xóa",
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
        />

        {/* Modal thêm bài học */}
        <LessonFormModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCreateLesson}
          isLoading={isLoading}
          mode="add"
          subjects={subjects}
          topics={topics}
          preSelectedFilters={{
            grade: selectedGrade,
            subject: selectedSubject,
            topic: selectedTopic,
          }}
        />

        {/* Modal chỉnh sửa bài học */}
        <LessonFormModal
          isOpen={isEditModalOpen && selectedLesson !== null}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateLesson}
          isLoading={isLoading}
          mode="edit"
          initialData={selectedLesson || {}}
          subjects={subjects}
          topics={topics}
        />
      </Wrapper>
    </>
  );
};

export default Lessons;
