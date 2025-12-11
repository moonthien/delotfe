import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { toast } from "react-toastify";
import {
  getUsers,
  getAllStudents,
  createUsers,
  updateUsers,
  deleteUsers,
  addMyStudent,
} from "../../services/apiService";
import { usersTableConfig } from "../../components/admin/tableConfigs";
import SearchAndFilter from "../../components/admin/SearchAndFilter";
import AdvancedFilter from "../../components/admin/AdvancedFilter";
import ModalStudent from "../../components/admin/user/ModalStudent";
import UserFormModal from "../../components/admin/user/UserFormModal";
import ModalAddStudent from "../../components/admin/user/ModalAddStudent";
import ModalUpdateStudent from "../../components/admin/user/ModalUpdateStudent";
import GenericTable from "../../components/admin/GenericTable";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden; /* ❗ Nếu muốn cuộn trang thì đổi thành auto  */
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

// Filter options for role dropdown
const roleFilterOptions = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "user", label: "Người dùng" },
  { value: "admin", label: "Quản trị viên" },
];

const Students = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStudents, setUserStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isUpdateStudentModalOpen, setIsUpdateStudentModalOpen] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sorting states
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching users and students...");

        // Fetch users
        const usersRes = await getUsers();
        const usersData = usersRes.data.data || [];
        console.log("👥 Fetched users:", usersData);
        console.log(
          "📊 Users by role:",
          usersData.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
          }, {})
        );

        setUsers(usersData);
        setFilteredUsers(usersData);

        // Fetch all students (với limit cao để lấy tất cả)
        const studentsRes = await getAllStudents(1, 1000);
        const studentsData = studentsRes.data.data || [];
        setAllStudents(studentsData);

        console.log("Fetched students:", studentsData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Get nested value for sorting - defined before use
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : "";
    }, obj);
  };

  // Filter users based on role and search term
  useEffect(() => {
    console.log("🔍 Filtering users:", {
      roleFilter,
      searchTerm,
      usersLength: users.length,
    });

    let filtered = users;

    // Filter by role
    if (roleFilter !== "all") {
      console.log("🎯 Filtering by role:", roleFilter);
      filtered = filtered.filter((user) => user.role === roleFilter);
      console.log("📋 After role filter:", filtered.length);
    } else {
      console.log("✅ Showing all roles");
    }

    // Filter by search term
    if (searchTerm) {
      console.log("🔍 Filtering by search term:", searchTerm);
      filtered = filtered.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("📋 After search filter:", filtered.length);
    }

    console.log("🎯 Final filtered users:", filtered);
    setFilteredUsers(filtered);
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    // Reset sorting when filter changes
    setSortField("");
    setSortDirection("asc");
  }, [users, roleFilter, searchTerm]);

  // Sort filtered users
  const getSortedUsers = () => {
    if (!sortField) return filteredUsers;

    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Handle boolean fields
      if (sortField === "isActive" || sortField === "isVerified") {
        aValue = Boolean(aValue);
        bValue = Boolean(bValue);
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

  const sortedUsers = getSortedUsers();

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

  const handleEdit = (user) => {
    setSelectedEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa tài khoản "${
          user.username || user.email
        }"?\n\nLưu ý: Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác!`
      )
    ) {
      try {
        console.log("Deleting user:", user);

        await deleteUsers(user._id);

        // Remove user from local state
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        setFilteredUsers((prev) => prev.filter((u) => u._id !== user._id));

        toast.success("Tài khoản đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting user:", error);

        const errorMessage =
          error.response?.data?.message || "Có lỗi xảy ra khi xóa tài khoản";
        toast.error(`Lỗi: ${errorMessage}`);
      }
    }
  };

  // const handleAdd = () => {
  //   setIsAddModalOpen(true);
  // };

  const handleCreateUser = async (userData) => {
    try {
      setIsCreatingUser(true);

      console.log("Creating user with data:", userData);

      // Call API to create user
      const response = await createUsers(userData);

      console.log("User created successfully:", response.data);

      // Add new user to local state
      const newUser = response.data.data || response.data;
      setUsers((prev) => [...prev, newUser]);
      setFilteredUsers((prev) => [...prev, newUser]);

      // Close modal and show success message
      setIsAddModalOpen(false);
      toast.success("Tài khoản đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating user:", error);

      // Show error message
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo tài khoản";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      setIsUpdatingUser(true);

      console.log("Updating user:", userId, userData);

      // Call API to update user
      const response = await updateUsers(userId, userData);

      console.log("User updated successfully:", response.data);

      // Update user in local state
      const updatedUser = response.data.data || response.data;
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );

      // Close modal and show success message
      setIsEditModalOpen(false);
      setSelectedEditUser(null);
      toast.success("Tài khoản đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating user:", error);

      // Show error message
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật tài khoản";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditUser(null);
  };

  const handleViewStudents = (user) => {
    console.log("View students for user:", user);
    console.log("All students:", allStudents);
    setSelectedUser(user);

    // Filter students for this user
    const userStudentsFiltered = allStudents.filter((student) => {
      console.log(
        "Comparing student userId:",
        student.userId,
        "with user._id:",
        user._id
      );

      // Kiểm tra null/undefined trước
      if (!student.userId) return false;

      // Xử lý trường hợp userId có thể là object hoặc string
      const studentUserId =
        typeof student.userId === "object"
          ? student.userId._id
          : student.userId;

      console.log("Processed studentUserId:", studentUserId);
      return studentUserId === user._id;
    });

    console.log("Filtered students for user:", userStudentsFiltered);
    setUserStudents(userStudentsFiltered);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserStudents([]);
  };

  // Student actions
  const handleAddStudent = () => {
    console.log("Add student for user:", selectedUser);
    setIsAddStudentModalOpen(true);
  };

  const handleAddStudentSubmit = async (studentData) => {
    try {
      setIsAddingStudent(true);

      console.log("Adding student with data:", studentData);

      // Call API to add student
      const response = await addMyStudent(studentData);

      console.log("Student added successfully:", response.data);

      // Add new student to local state
      const newStudent = response.data.data || response.data;
      setAllStudents((prev) => [...prev, newStudent]);
      setUserStudents((prev) => [...prev, newStudent]);

      // Close modal and show success message
      setIsAddStudentModalOpen(false);
      toast.success("Học sinh đã được thêm thành công!");
    } catch (error) {
      console.error("Error adding student:", error);

      // Show error message
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi thêm học sinh";
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleCloseAddStudentModal = () => {
    setIsAddStudentModalOpen(false);
  };

  const handleEditStudent = (student) => {
    console.log("Edit student:", student);
    setSelectedStudent(student);
    setIsUpdateStudentModalOpen(true);
  };

  const handleDeleteStudent = async (student) => {
    console.log("Delete student callback:", student);
    // Cập nhật state local ngay lập tức để UI phản hồi nhanh
    const studentId = student.id || student._id;
    setAllStudents((prev) => prev.filter((s) => (s.id || s._id) !== studentId));
    setUserStudents((prev) =>
      prev.filter((s) => (s.id || s._id) !== studentId)
    );
    toast.success(`Đã xóa học sinh: ${student.name}`);
  };

  const handleUpdateStudent = async (updatedStudent) => {
    console.log("Update student callback:", updatedStudent);
    // Cập nhật state local ngay lập tức
    const studentId = updatedStudent.id || updatedStudent._id;
    setAllStudents((prev) =>
      prev.map((s) =>
        (s.id || s._id) === studentId ? { ...s, ...updatedStudent } : s
      )
    );
    setUserStudents((prev) =>
      prev.map((s) =>
        (s.id || s._id) === studentId ? { ...s, ...updatedStudent } : s
      )
    );
  };

  // Helper function to get student count for a user
  const getStudentCount = (userId) => {
    return allStudents.filter((s) => {
      if (!s.userId) return false;
      const studentUserId =
        typeof s.userId === "object" ? s.userId._id : s.userId;
      return studentUserId === userId;
    }).length;
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <PageTitle>
          <span className="icon">👥</span>
          <span className="text">Quản lý Tài khoản</span>
        </PageTitle>
        {/* Demo AdvancedFilter với cấu hình đơn giản hơn */}
        <AdvancedFilter
          searchConfig={{
            label: "Tìm kiếm tài khoản",
            placeholder: "Nhập email hoặc username...",
            value: searchTerm,
            onChange: setSearchTerm,
          }}
          filterConfigs={[
            {
              label: "Vai trò",
              value: roleFilter,
              onChange: setRoleFilter,
              placeholder: "", // Đặt placeholder rỗng để không tự tạo option
              options: roleFilterOptions,
            },
          ]}
          // addButtonConfig={{
          //   text: "Thêm tài khoản",
          //   icon: "👤",
          //   onClick: handleAdd,
          // }}
        />

        <GenericTable
          columns={usersTableConfig.columns}
          data={sortedUsers.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )}
          actions={[
            {
              label: "✏️",
              variant: "edit",
              onClick: handleEdit,
              title: "Chỉnh sửa",
            },
            {
              label: "🗑️",
              variant: "delete",
              onClick: handleDelete,
              title: "Xóa",
            },
          ]}
          additionalProps={{
            onViewStudents: handleViewStudents,
            getStudentCount: getStudentCount,
            startIndex: (currentPage - 1) * itemsPerPage,
          }}
          pagination={{
            currentPage,
            itemsPerPage,
            totalItems: sortedUsers.length,
            onPageChange: setCurrentPage,
            onItemsPerPageChange: setItemsPerPage,
          }}
          sorting={{
            sortField,
            sortDirection,
            onSort: handleSort,
          }}
        />

        {/* Modal hiển thị danh sách students */}
        <ModalStudent
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedUser={selectedUser}
          userStudents={userStudents}
          onAddStudent={handleAddStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />

        {/* Modal thêm tài khoản mới  */}
        <UserFormModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onSubmit={handleCreateUser}
          isLoading={isCreatingUser}
          mode="add"
        />

        <UserFormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={(formData) =>
            handleUpdateUser(selectedEditUser?._id, formData)
          }
          isLoading={isUpdatingUser}
          mode="edit"
          initialData={selectedEditUser}
        />

        {/* Modal thêm học sinh */}
        <ModalAddStudent
          isOpen={isAddStudentModalOpen}
          onClose={handleCloseAddStudentModal}
          onSubmit={handleAddStudentSubmit}
          isLoading={isAddingStudent}
          selectedUserId={selectedUser?._id || selectedUser?.id}
        />

        {/* Modal cập nhật học sinh */}
        <ModalUpdateStudent
          isOpen={isUpdateStudentModalOpen}
          onClose={() => setIsUpdateStudentModalOpen(false)}
          onUpdate={handleUpdateStudent}
          student={selectedStudent}
        />
      </Wrapper>
    </>
  );
};

export default Students;
