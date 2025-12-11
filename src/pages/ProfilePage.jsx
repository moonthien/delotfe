import React, { useEffect, useState } from "react";
import {
  getMyStudents,
  getResultsByStudent,
  updateStudent,
  sendOtp,
  changePasswordWithOtpAndOld,
  uploadImageStudent,
  getBadgesByStudent,
} from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileContent from "../components/profile/ProfileContent";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  GlobalStyle,
  Wrapper,
  Sidebar,
  Avatar,
  Name,
  Grade,
  UpdateAvatar,
  Menu,
  MenuItem,
  Content,
  HeaderInfo,
  UpdateBtn,
  InfoGrid,
  InfoRow,
  Label,
  Value,
  Message,
  ExamHistoryGrid,
  ExamHistoryCard,
  ExamHistoryRow,
  ModalOverlay,
  ModalContent,
  UploadContainer,
  UploadCircle,
  PlusSign,
  UploadText,
  AvatarGrid,
  CloseBtn,
  ConfirmBtn,
  ResultsTable,
  StyledInput,
} from "../pages/styles/ProfilePage.styles";
import styled from "styled-components";

// New styled component for achievements
const AchievementsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }

    span {
      color: #333;
    }
  }
`;

// New styled component for pagination controls
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  align-items: center;
`;

const PaginationButton = styled.button`
  padding: 8px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #2f9d2f;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  &:hover {
    background: #1e7b1e;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// New styled component for filter
const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2f9d2f;
  }
`;

// Static achievement data
const achievements = [
  { id: 1, icon: "https://images2.imgbox.com/c0/ca/fiOsK3ly_o.png", title: "Ngôi Sao" },
  { id: 2, icon: "https://images2.imgbox.com/25/9f/86kb5D8F_o.png", title: "Siêng Năng" },
  { id: 3, icon: "https://images2.imgbox.com/c3/3b/mOUj1ZFA_o.png", title: "Nhà Toán Học" },
];

const avatarOptions = [
  "https://i.postimg.cc/C5rMGKj7/ava1.png",
  "https://i.postimg.cc/sxHfY2p6/ava2.png",
  "https://i.postimg.cc/MH3Z7Gys/ava3.png",
  "https://i.postimg.cc/G3XpwX6W/ava4.png",
  "https://i.postimg.cc/8kZCQZq8/ava5.png",
  "https://i.postimg.cc/T2tPMtZP/ava6.png",
  "https://i.postimg.cc/7PKL8Kpf/ava7.png",
  "https://i.postimg.cc/kMT53TkG/ava8.png",
  "https://i.postimg.cc/05VNRVLr/ava9.png",
  "https://i.postimg.cc/kGv1zVjq/414653898-6ed5282a-2a53-4116-9364-edc15852de77.jpg",
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStudentId = React.useMemo(() => {
    try {
      const data = JSON.parse(localStorage.getItem("selectedStudent") || "null");
      return data?._id || data?.id || null;
    } catch {
      return null;
    }
  }, []);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examHistory, setExamHistory] = useState([]);
  const [filteredExamHistory, setFilteredExamHistory] = useState([]);
  const [activeSection, setActiveSection] = useState(location.state?.section || "profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all"); // State for filter
  const [chartType, setChartType] = useState("bar");
  const [badges, setBadges] = useState([]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // Hàm handleSort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // Reset về mặc định (mới nhất trước)
    }
    setSortConfig({ key, direction });
  };

  // Hàm getSortedData
  const getSortedData = () => {
    let dataToSort = [...filteredExamHistory]; // Copy để tránh mutate state

    if (!sortConfig.key || sortConfig.direction === null) {
      // Mặc định: sort theo ngày mới nhất trước (desc createdAt)
      return dataToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Sort theo key
    dataToSort.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'subject':
          aValue = (a.refId?.subjectId?.name || a.refId?.topicId?.subjectId?.name || a.refId?.topicId?.name || '').toLowerCase();
          bValue = (b.refId?.subjectId?.name || b.refId?.topicId?.subjectId?.name || b.refId?.topicId?.name || '').toLowerCase();
          break;
        case 'type':
          aValue = a.refType === 'Lesson' ? 'Ôn tập' : (a.refId?.period || a.refId?.name || '');
          bValue = b.refType === 'Lesson' ? 'Ôn tập' : (b.refId?.period || b.refId?.name || '');
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'correct':
          aValue = a.correctAnswers;
          bValue = b.correctAnswers;
          break;
        case 'wrong':
          aValue = a.answers.length - a.correctAnswers;
          bValue = b.answers.length - b.correctAnswers;
          break;
        case 'time':
          aValue = a.timeSpent;
          bValue = b.timeSpent;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return dataToSort;
  };

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    if (student) {
      setEditName(student.name || "");
      setEditClass(student.class || "");
      setEditDob(student.dateofBirth ? student.dateofBirth.split("T")[0] : "");
      setEditPhone(student.phoneNumber || "");
    }
  }, [student]);

  // Đổi mật khẩu state
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // Fetch student information
  useEffect(() => {
    if (selectedStudentId) {
      fetchStudent(selectedStudentId);
    } else {
      setLoading(false);
    }
  }, [selectedStudentId]);

  const fetchStudent = async (id) => {
    try {
      const res = await getMyStudents();
      const myStudents = res.data.data || [];
      const found = myStudents.find((s) => s._id === id);

      if (!found) throw new Error("Không tìm thấy học sinh của bạn");
      setStudent(found);
      await fetchBadges(id);
    } catch (err) {
      console.error("❌ Lỗi lấy thông tin học sinh:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async (id) => {
    try {
      const res = await getBadgesByStudent(id);
      const data = res.data.data?.badges || [];
      setBadges(data);
    } catch (err) {
      console.error("❌ Lỗi lấy huy hiệu:", err);
    }
  };

  // Fetch exam history
  const fetchExamHistory = async () => {
    try {
      const res = await getResultsByStudent(selectedStudentId);
      const sorted = (res.data.data || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ); // sắp xếp từ cũ -> mới
      setExamHistory(sorted);
      setFilteredExamHistory(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Lỗi lấy lịch sử bài làm:", err);
    }
  };

  // Filter exam history based on selected type
  useEffect(() => {
    if (filterType === "all") {
      setFilteredExamHistory(examHistory);
    } else if (filterType === "Ôn tập") {
      setFilteredExamHistory(
        examHistory.filter((result) => result.refType === "Lesson")
      );
    } else if (filterType === "Kiểm tra") {
      setFilteredExamHistory(
        examHistory.filter((result) => result.refType !== "Lesson")
      );
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filterType, examHistory]);

  const handleMenuClick = (section) => {
    setActiveSection(section);
    if (section === "history" || section === "stats") {
      fetchExamHistory();
    } else if (section === "logout") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("selectedStudent");
      navigate("/");
    }
  };

  const handleAvatarUpdate = async (url) => {
    try {
      const res = await updateStudent(student._id, { avatar: url });
      setStudent(res.data.data);
      localStorage.setItem("selectedStudent", JSON.stringify(res.data.data));
      window.dispatchEvent(new Event("studentUpdated"));
      setIsModalOpen(false);
      setPreviewImage(null);
      setSelectedAvatar(null);
      toast.success("Cập nhật avatar thành công!");
    } catch (err) {
      console.error("❌ Lỗi cập nhật avatar:", err);
      if (err.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else if (err.response?.status === 403) {
        alert("Bạn không có quyền cập nhật học sinh này!");
      } else {
        alert("Có lỗi xảy ra khi cập nhật avatar.");
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setSelectedAvatar(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAvatar = async () => {
    if (previewImage) {
      try {
        const fileInput = document.getElementById("avatar-upload");
        const file = fileInput.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("avatar", file);
          const res = await uploadImageStudent(formData);
          const uploadedUrl = res.data.data.cloudinaryUrl;
          await handleAvatarUpdate(uploadedUrl);
        } else {
          toast.error("Vui lòng chọn một hình ảnh để tải lên");
        }
      } catch (err) {
        console.error("❌ Lỗi upload avatar:", err);
        toast.error("Upload avatar thất bại");
        setPreviewImage(null);
        setSelectedAvatar(null);
      }
    } else if (selectedAvatar) {
      await handleAvatarUpdate(selectedAvatar);
    } else {
      toast.error("Vui lòng chọn hoặc tải lên một hình ảnh");
    }
  };

  const handleSelectAvatar = (url) => {
    setSelectedAvatar(url);
    setPreviewImage(null);
  };

  // Save edited profile info
  const handleSaveInfo = async () => {
    try {
      const updateData = {
        name: editName,
        class: editClass,
        dateofBirth: editDob,
        phoneNumber: editPhone,
      };

      const res = await updateStudent(student._id, updateData);
      setStudent(res.data.data);
      localStorage.setItem("selectedStudent", JSON.stringify(res.data.data));
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Lỗi cập nhật thông tin:", err);
      toast.error("Cập nhật thất bại");
    }
  };

  // Gửi OTP
  const handleSendOtp = async () => {
    const username = student?.userId?.username;
    const email = student?.userId?.email;
    if (!username || !email) {
      toast.error("Không tìm thấy thông tin tài khoản!");
      return;
    }
    try {
      await sendOtp(username, email, "verify");
      toast.success("OTP đã được gửi tới email của bạn");
    } catch (err) {
      console.error("❌ Lỗi gửi OTP:", err);
      toast.error(err.response?.data?.message || "Gửi OTP thất bại");
    }
  };

  const handleChangePassword = async () => {
    const email = student?.userId?.email;

    if (!email || !oldPassword || !newPassword || !confirmPassword || !otpCode) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (otpCode.length !== 6) {
      toast.error("OTP phải gồm 6 số");
      return;
    }

    try {
      setPwdLoading(true);
      const username = student?.userId?.username;
      const res = await changePasswordWithOtpAndOld(
        username,
        email,
        oldPassword,
        newPassword,
        otpCode
      );
      toast.success(res.data.message || "Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode("");

      setTimeout(() => {
        localStorage.clear();
        navigate("/dang-nhap");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setPwdLoading(false);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có ngày";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0 giây";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes} phút ${secs} giây`;
    }
    return `${secs} giây`;
  };

  // Pagination logic
  const sortedData = getSortedData();
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentExam = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) return <Message>Đang tải thông tin học sinh...</Message>;
  if (!student)
    return (
      <Message>Không tìm thấy thông tin học sinh. Vui lòng chọn lại.</Message>
    );

  return (
    <>
      <GlobalStyle />
      <Header />
      <Wrapper>
        {/* Sidebar */}
        <Sidebar>
          <Avatar
            src={
              student?.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            }
            alt={student?.name}
          />
          <Name>{student?.name || "Chưa có"}</Name>
          <Grade>Lớp {student?.class || "Chưa có"}</Grade>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            {badges.length > 0 ? (
              badges.map((item) => (
                <img
                  key={item._id}
                  src={item.badgeId?.icon}
                  alt={item.badgeId?.title}
                  title={item.badgeId?.title}
                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                />
              ))
            ) : (
              <span style={{ fontSize: "12px", color: "#777" }}>Chưa có huy hiệu</span>
            )}
          </div>
          <UpdateAvatar onClick={() => setIsModalOpen(true)}>
            Cập nhật avatar
          </UpdateAvatar>
          <Menu>
            <MenuItem
              className={activeSection === "profile" ? "active" : ""}
              onClick={() => handleMenuClick("profile")}
            >
              <img src="/assets/profile_14026766.png" alt="Thông tin cá nhân" />
              Thông tin cá nhân
            </MenuItem>
            <MenuItem
              className={activeSection === "password" ? "active" : ""}
              onClick={() => handleMenuClick("password")}
            >
              <img src="/assets/transport_14388848.png" alt="Đổi mật khẩu" />
              Đổi mật khẩu
            </MenuItem>
            <MenuItem
              className={activeSection === "history" ? "active" : ""}
              onClick={() => handleMenuClick("history")}
            >
              <img src="/assets/list.png" alt="Lịch sử bài làm" />
              Lịch sử bài làm
            </MenuItem>
            <MenuItem
              className={activeSection === "stats" ? "active" : ""}
              onClick={() => handleMenuClick("stats")}
            >
              <img src="/assets/chart.png" alt="Thống kê học tập" />
              Thống kê học tập
            </MenuItem>
            <MenuItem onClick={() => handleMenuClick("logout")}>
              <img src="/assets/log-out_4113679.png" alt="Đăng xuất" />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Sidebar>

        {/* Main content */}
        <ProfileContent
          activeSection={activeSection}
          student={student}
          isEditing={isEditing}
          editName={editName}
          editClass={editClass}
          editDob={editDob}
          oldPassword={oldPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          otpCode={otpCode}
          pwdLoading={pwdLoading}
          filteredExamHistory={filteredExamHistory}
          filterType={filterType}
          setFilterType={setFilterType}
          handleSaveInfo={handleSaveInfo}
          setIsEditing={setIsEditing}
          handleSendOtp={handleSendOtp}
          handleChangePassword={handleChangePassword}
          formatTime={formatTime}
          formatDate={formatDate}
          currentExam={currentExam}
          handleSort={handleSort}
          sortConfig={sortConfig}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          badges={badges}
          AchievementsContainer={AchievementsContainer}
          FilterContainer={FilterContainer}
          FilterSelect={FilterSelect}
          PaginationContainer={PaginationContainer}
          PaginationButton={PaginationButton}
          setOldPassword={setOldPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          setOtpCode={setOtpCode}
          setEditName={setEditName}
          setEditClass={setEditClass}
          setEditDob={setEditDob}
          chartType={chartType}
          setChartType={setChartType}
        />
      </Wrapper>
      <Footer />

      {/* Modal chọn avatar */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <UploadContainer>
              <label htmlFor="avatar-upload">
                <UploadCircle>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <PlusSign>+</PlusSign>
                  )}
                </UploadCircle>
                <UploadText>Chọn ảnh từ máy hoặc ảnh có sẵn</UploadText>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </UploadContainer>
            
            <AvatarGrid>
              {avatarOptions.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="avatar"
                  style={{
                    border: selectedAvatar === url ? "2px solid #2f9d2f" : "2px solid transparent",
                  }}
                  onClick={() => handleSelectAvatar(url)}
                />
              ))}
            </AvatarGrid>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <CloseBtn onClick={() => {setIsModalOpen(false); setPreviewImage(null); setSelectedAvatar(null);}}>
                Đóng
              </CloseBtn>
              <ConfirmBtn onClick={handleConfirmAvatar}>
                Xác nhận
              </ConfirmBtn>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ProfilePage;