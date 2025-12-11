import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createGlobalStyle } from "styled-components";
import {
  BarChart3,
  UserSquare,
  BookOpen,
  ListChecks,
  Notebook,
  ClipboardCheck,
  Medal,
  MessageSquare,
} from "lucide-react";
import Layout1 from "../../components/admin/layout/Layout1";
import { logout } from "../../redux/slice/adminAuthSlice";
import { toast } from "react-toastify";

// ----- GlobalStyle copy -----
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Impress';
    src: url('/fonts/SVN-Impress.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'SmoochSans-Medium';
    src: url('/fonts/SmoochSans-Medium.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

// AdminLayout now simply wraps Layout1

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <BarChart3 size={18} />,
    },
    {
      to: "/admin/students",
      label: "Tài khoản",
      icon: <UserSquare size={18} />,
    },
    { to: "/admin/mon-hoc", label: "Môn học", icon: <BookOpen size={18} /> },
    { to: "/admin/chu-de", label: "Chủ đề", icon: <ListChecks size={18} /> },
    {
      to: "/admin/bai-hoc",
      label: "Học bài",
      icon: <Notebook size={18} />,
      submenu: [
        // { to: "/admin/bai-hoc", label: "Bài học", icon: <Notebook size={16} /> },
        { to: "/admin/bai-hoc", label: "Video", icon: "🎥" },
        { to: "/admin/ontap", label: "Bài ôn tập", icon: "📝" },
        {
          to: "/admin/bai-kiem-tra",
          label: "Bài kiểm tra",
          icon: <ClipboardCheck size={16} />,
        },
      ],
    },
    { to: "/admin/huy-hieu", label: "Huy hiệu", icon: <Medal size={18} /> },
    // {
    //   to: "/admin/binh-luan",
    //   label: "Bình luận",
    //   icon: <MessageSquare size={18} />,
    // },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đã đăng xuất thành công!");
    navigate("/loginAdmin");
  };

  return (
    <>
      <GlobalStyle />
      <Layout1
        menuItems={menuItems}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />
    </>
  );
};

export default AdminLayout;
