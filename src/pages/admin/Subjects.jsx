import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/apiService";
import { subjectsTableConfig } from "../../components/admin/tableConfigs";
import GenericTable from "../../components/admin/GenericTable";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import SubjectFormModal from "../../components/admin/subject/SubjectFormModal";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Montserrat', sans-serif;
  }

  #root {
    width: 100%;
    height: 100%;
  }
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

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedTap, setSelectedTap] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  // Get unique grades and taps for filter options
  const uniqueGrades = [
    ...new Set(
      subjects.map((subject) => subject.grade).filter((grade) => grade != null)
    ),
  ].sort((a, b) => a - b);
  const uniqueTaps = [
    ...new Set(
      subjects.map((subject) => subject.tap).filter((tap) => tap != null)
    ),
  ].sort((a, b) => a - b);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getAllSubjects();
        const subjectsData = res.data.data || [];
        setSubjects(subjectsData);
        setFilteredSubjects(subjectsData);
        console.log("Fetched subjects:", subjectsData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Get nested value for sorting - defined before use
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Filter subjects based on search term, grade, and tap
  useEffect(() => {
    let filtered = subjects;

    if (search) {
      filtered = filtered.filter((subject) =>
        subject.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(
        (subject) => subject.grade?.toString() === selectedGrade
      );
    }

    if (selectedTap) {
      filtered = filtered.filter(
        (subject) => subject.tap?.toString() === selectedTap
      );
    }

    setFilteredSubjects(filtered);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Reset sorting when filter changes
    setSortField("");
    setSortDirection("asc");
  }, [subjects, search, selectedGrade, selectedTap]);

  // Sort filtered subjects
  const getSortedSubjects = () => {
    if (!sortField) return filteredSubjects;

    const sorted = [...filteredSubjects].sort((a, b) => {
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
      // Handle number fields (grade, tap)
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

  const sortedSubjects = getSortedSubjects();

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

  const handleAddSubject = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateSubject = async (subjectData) => {
    try {
      setIsLoading(true);

      console.log("Creating subject with data:", subjectData);

      const response = await createSubject(subjectData);
      console.log("Subject created successfully:", response.data);

      const newSubject = response.data.data || response.data;
      setSubjects((prev) => [...prev, newSubject]);
      setFilteredSubjects((prev) => [...prev, newSubject]);

      setIsAddModalOpen(false);
      toast.success("Môn học đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating subject:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo môn học";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSubject(null);
  };

  const handleUpdateSubject = async (subjectData) => {
    if (!selectedSubject) {
      console.error("No subject selected for update");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Updating subject:", selectedSubject._id, subjectData);

      const response = await updateSubject(selectedSubject._id, subjectData);
      console.log("Subject updated successfully:", response.data);

      const updatedSubject = response.data.data || response.data;
      setSubjects((prev) =>
        prev.map((s) => (s._id === selectedSubject._id ? updatedSubject : s))
      );
      setFilteredSubjects((prev) =>
        prev.map((s) => (s._id === selectedSubject._id ? updatedSubject : s))
      );

      setIsEditModalOpen(false);
      setSelectedSubject(null);
      toast.success("Môn học đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating subject:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật môn học";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubject = async (subject) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa môn học "${subject.name}"?\n\nLưu ý: Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác!`
      )
    ) {
      try {
        console.log("Deleting subject:", subject);

        await deleteSubject(subject._id);

        setSubjects((prev) => prev.filter((s) => s._id !== subject._id));
        setFilteredSubjects((prev) =>
          prev.filter((s) => s._id !== subject._id)
        );

        toast.success("Môn học đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting subject:", error);
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi xóa môn học";
        toast.error(`Lỗi: ${errorMessage}`);
      }
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedGrade("");
    setSelectedTap("");
    // Reset sorting when clearing filters
    setSortField("");
    setSortDirection("asc");
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">📚</span>
          <span className="text">Quản lý Chương trình học</span>
        </PageTitle>
        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm môn học",
            placeholder: "Nhập tên môn học...",
            value: search,
            onChange: setSearch,
          }}
          filterConfigs={[
            {
              label: "Lớp",
              value: selectedGrade,
              onChange: setSelectedGrade,
              placeholder: "Tất cả lớp",
              options: uniqueGrades
                .filter((grade) => grade != null)
                .map((grade) => ({
                  value: grade.toString(),
                  label: `Lớp ${grade}`,
                })),
            },
            {
              label: "Học kỳ",
              value: selectedTap,
              onChange: setSelectedTap,
              placeholder: "Tất cả học kỳ",
              options: uniqueTaps
                .filter((tap) => tap != null)
                .map((tap) => ({
                  value: tap.toString(),
                  label: `Học kỳ ${tap}`,
                })),
            },
          ]}
          addButtonConfig={{
            text: "Thêm chương trình  học",
            // icon: <span style={{ color: "#ff9900" }}>➕</span> ,
            onClick: handleAddSubject,
          }}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={subjectsTableConfig.columns}
          data={sortedSubjects.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          actions={[
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEditSubject,
              title: "Chỉnh sửa",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDeleteSubject,
              title: "Xóa",
            },
          ]}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: sortedSubjects.length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
        />

        {/* Modal thêm môn học */}
        <SubjectFormModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCreateSubject}
          isLoading={isLoading}
          mode="add"
          preSelectedFilters={{
            grade: selectedGrade,
            tap: selectedTap,
          }}
        />

        {/* Modal chỉnh sửa môn học */}
        <SubjectFormModal
          isOpen={isEditModalOpen && selectedSubject !== null}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateSubject}
          isLoading={isLoading}
          mode="edit"
          initialData={selectedSubject || {}}
        />
      </Wrapper>
    </>
  );
};

export default Subjects;
