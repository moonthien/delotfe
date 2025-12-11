import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  getAllTopics,
  getAllSubjects,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../../services/apiService";
import { topicsTableConfig } from "../../components/admin/tableConfigs";
import GenericTable from "../../components/admin/GenericTable";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import TopicFormModal from "../../components/admin/topic/TopicFormModal";
import { toast } from "react-toastify";

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

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  // Get unique grades for filter options
  const uniqueGrades = [
    ...new Set(topics.map((topic) => topic.subjectId?.grade).filter(Boolean)),
  ].sort((a, b) => a - b);

  // Get filtered subjects based on selected grade
  const getFilteredSubjects = () => {
    if (!selectedGrade) {
      // Nếu chưa chọn lớp, hiển thị tất cả môn học
      return [
        ...new Set(
          topics.map((topic) => topic.subjectId?.name).filter(Boolean)
        ),
      ].sort();
    } else {
      // Nếu đã chọn lớp, chỉ hiển thị môn học của lớp đó
      return [
        ...new Set(
          topics
            .filter(
              (topic) => topic.subjectId?.grade?.toString() === selectedGrade
            )
            .map((topic) => topic.subjectId?.name)
            .filter(Boolean)
        ),
      ].sort();
    }
  };

  const filteredSubjects = getFilteredSubjects();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, subjectsRes] = await Promise.all([
          getAllTopics(),
          getAllSubjects(),
        ]);

        // Sắp xếp topics theo lớp (grade tăng dần)
        const sortedTopics = (topicsRes.data.data || []).sort(
          (a, b) => (a.subjectId?.grade || 0) - (b.subjectId?.grade || 0)
        );
        setTopics(sortedTopics);
        setFilteredTopics(sortedTopics);

        // Set subjects for modal form
        setSubjects(subjectsRes.data.data || []);

        console.log("Fetched topics:", topicsRes.data.data);
        console.log("Fetched subjects:", subjectsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };
    fetchData();
  }, []);

  // Filter topics based on search term, subject, and grade
  useEffect(() => {
    let filtered = topics;

    if (search) {
      filtered = filtered.filter(
        (topic) =>
          topic.title?.toLowerCase().includes(search.toLowerCase()) ||
          topic.subjectId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(
        (topic) => topic.subjectId?.name === selectedSubject
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(
        (topic) => topic.subjectId?.grade?.toString() === selectedGrade
      );
    }

    setFilteredTopics(filtered);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Reset sorting when filter changes
    setSortField("");
    setSortDirection("asc");
  }, [topics, search, selectedSubject, selectedGrade]);

  // Reset selectedSubject khi thay đổi lớp
  useEffect(() => {
    if (selectedGrade) {
      const availableSubjects = getFilteredSubjects();
      // Nếu môn học đã chọn không có trong lớp mới, reset về rỗng
      if (selectedSubject && !availableSubjects.includes(selectedSubject)) {
        setSelectedSubject("");
      }
    }
  }, [selectedGrade]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTopic = () => {
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedSubject("");
    setSelectedGrade("");
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

  // Get nested value for sorting
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Sort filtered topics
  const getSortedTopics = () => {
    if (!sortField) return filteredTopics;

    const sorted = [...filteredTopics].sort((a, b) => {
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
      else if (sortField === "subjectId.grade") {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const sortedTopics = getSortedTopics();

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleDeleteTopic = async (topic) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa chủ đề "${topic.title}"?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteTopic(topic._id);
      toast.success("Xóa chủ đề thành công!");

      // Refresh topics list
      const res = await getAllTopics();
      const sortedTopics = (res.data.data || []).sort(
        (a, b) => (a.subjectId?.grade || 0) - (b.subjectId?.grade || 0)
      );
      setTopics(sortedTopics);
      setFilteredTopics(sortedTopics);
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Có lỗi xảy ra khi xóa chủ đề");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTopic(null);
  };

  const handleSubmitTopic = async (formData) => {
    setIsLoading(true);
    try {
      if (editingTopic) {
        // Update existing topic
        await updateTopic(editingTopic._id, formData);
        toast.success("Cập nhật chủ đề thành công!");
      } else {
        // Create new topic
        await createTopic(formData);
        toast.success("Tạo chủ đề thành công!");
      }

      // Refresh topics list
      const res = await getAllTopics();
      const sortedTopics = (res.data.data || []).sort(
        (a, b) => (a.subjectId?.grade || 0) - (b.subjectId?.grade || 0)
      );
      setTopics(sortedTopics);
      setFilteredTopics(sortedTopics);

      handleCloseModal();
    } catch (error) {
      console.error("Error submitting topic:", error);
      toast.error(
        `Có lỗi xảy ra khi ${editingTopic ? "cập nhật" : "tạo"} chủ đề`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">📝</span>
          <span className="text">Quản lý Chủ đề</span>
        </PageTitle>
        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm chủ đề",
            placeholder: "Nhập tên chủ đề hoặc môn học...",
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
          ]}
          addButtonConfig={{
            text: "Thêm chủ đề",
            icon: "📝",
            onClick: handleAddTopic,
          }}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={topicsTableConfig.columns}
          data={sortedTopics.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          actions={[
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEditTopic,
              title: "Chỉnh sửa",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDeleteTopic,
              title: "Xóa",
            },
          ]}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: sortedTopics.length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
        />

        <TopicFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitTopic}
          isLoading={isLoading}
          mode={editingTopic ? "edit" : "add"}
          initialData={editingTopic}
          subjects={subjects}
          preSelectedFilters={{
            grade: selectedGrade,
            subject: selectedSubject,
          }}
        />
      </Wrapper>
    </>
  );
};

export default Topics;
