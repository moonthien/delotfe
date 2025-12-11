import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  getAllBadges,
  createBadge,
  updateBadge,
  deleteBadge,
} from "../../services/apiService";
import GenericTable from "../../components/admin/GenericTable";
import { badgesTableConfig } from "../../components/admin/tableConfigs";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import BadgeFormModal from "../../components/admin/badge/BadgeFormModal";

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

// Filter options for category dropdown
const categoryFilterOptions = [
  { value: "all", label: "Tất cả danh mục" },
  { value: "chuyencan", label: "Chuyên cần" },
  { value: "soluong", label: "Số lượng" },
  { value: "dacbiet", label: "Đặc biệt" },
];

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await getAllBadges();
        console.log("API response for getAllBadges:", res);

        const badgesData = Array.isArray(res.data.data.badges)
          ? res.data.data.badges
          : [];
        setBadges(badgesData);
        setFilteredBadges(badgesData);
        console.log("Fetched badges:", badgesData);
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách huy hiệu");
        // Đảm bảo state vẫn là array nếu có lỗi
        setBadges([]);
        setFilteredBadges([]);
      }
    };
    fetchBadges();
  }, []);

  // Get nested value for sorting - defined before use
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Filter badges based on search term and category
  useEffect(() => {
    let filtered = Array.isArray(badges) ? badges : [];

    if (searchTerm) {
      filtered = filtered.filter(
        (badge) =>
          badge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          badge.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          badge.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((badge) => badge.category === categoryFilter);
    }

    setFilteredBadges(filtered);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Reset sorting when filter changes
    setSortField("");
    setSortDirection("asc");
  }, [badges, searchTerm, categoryFilter]);

  // Sort filtered badges
  const getSortedBadges = () => {
    if (!sortField) return filteredBadges;

    const sorted = [...filteredBadges].sort((a, b) => {
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

  const sortedBadges = getSortedBadges();

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

  const handleAddBadge = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateBadge = async (badgeData) => {
    try {
      setIsLoading(true);

      console.log("Creating badge with data:", badgeData);

      const response = await createBadge(badgeData);
      console.log("Badge created successfully:", response.data);

      const newBadge = response.data.data || response.data;
      setBadges((prev) => [...prev, newBadge]);
      setFilteredBadges((prev) => [...prev, newBadge]);

      setIsAddModalOpen(false);
      toast.success("Huy hiệu đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating badge:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo huy hiệu";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBadge = (badge) => {
    setSelectedBadge(badge);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBadge(null);
  };

  const handleUpdateBadge = async (badgeData) => {
    if (!selectedBadge) {
      console.error("No badge selected for update");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Updating badge:", selectedBadge._id, badgeData);

      const response = await updateBadge(selectedBadge._id, badgeData);
      console.log("Badge updated successfully:", response.data);

      const updatedBadge = response.data.data || response.data;
      setBadges((prev) =>
        prev.map((b) => (b._id === selectedBadge._id ? updatedBadge : b))
      );
      setFilteredBadges((prev) =>
        prev.map((b) => (b._id === selectedBadge._id ? updatedBadge : b))
      );

      setIsEditModalOpen(false);
      setSelectedBadge(null);
      toast.success("Huy hiệu đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating badge:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật huy hiệu";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBadge = async (badge) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa huy hiệu "${badge.name}"?\n\nLưu ý: Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác!`
      )
    ) {
      try {
        console.log("Deleting badge:", badge);

        await deleteBadge(badge._id);

        setBadges((prev) => prev.filter((b) => b._id !== badge._id));
        setFilteredBadges((prev) => prev.filter((b) => b._id !== badge._id));

        toast.success("Huy hiệu đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting badge:", error);
        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi xóa huy hiệu";
        toast.error(`Lỗi: ${errorMessage}`);
      }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    // Reset sorting when clearing filters
    setSortField("");
    setSortDirection("asc");
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">🏆</span>
          <span className="text">Quản lý Huy hiệu</span>
        </PageTitle>

        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm huy hiệu",
            placeholder: "Nhập tên, mô tả hoặc danh mục huy hiệu...",
            value: searchTerm,
            onChange: setSearchTerm,
          }}
          filterConfigs={[
            {
              label: "Danh mục",
              value: categoryFilter,
              onChange: setCategoryFilter,
              placeholder: "",
              options: categoryFilterOptions,
            },
          ]}
          addButtonConfig={{
            text: "Thêm huy hiệu",
            onClick: handleAddBadge,
          }}
          onClearFilters={handleClearFilters}
        />

        <GenericTable
          columns={badgesTableConfig.columns}
          data={(sortedBadges || []).slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          actions={[
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEditBadge,
              title: "Chỉnh sửa",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDeleteBadge,
              title: "Xóa",
            },
          ]}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: (sortedBadges || []).length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
        />

        {/* Modal thêm huy hiệu */}
        <BadgeFormModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCreateBadge}
          isLoading={isLoading}
          mode="add"
        />

        {/* Modal chỉnh sửa huy hiệu */}
        <BadgeFormModal
          isOpen={isEditModalOpen && selectedBadge !== null}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateBadge}
          isLoading={isLoading}
          mode="edit"
          initialData={selectedBadge || {}}
        />
      </Wrapper>
    </>
  );
};

export default Badges;
