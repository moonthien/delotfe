import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Website cho học sinh ---
import HomePage from "./pages/HomePage";
import MathPage from "./pages/MathPage";
import VietnamesePage from "./pages/VietnamesePage";
import HuyHieu from "./pages/HuyHieu";
import DoiQua from "./pages/DoiQua";
import RankingPage from "./pages/RankingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ManageProfiles from "./pages/ManageProfiles";
import ProfilePage from "./pages/ProfilePage";
import ExamListPage from "./pages/ExamListPage";
import ExamQuestionPage from "./pages/ExamQuestionPage";
import AIQuestionPage from "./pages/AIQuestionPage";
import TrangTriCayThongPage from "./pages/TrangTriCayThongPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage";
// --- Admin ---
import AdminLayout from "./pages/admin/AdminLayout";
import Students from "./pages/admin/Students";
import Subjects from "./pages/admin/Subjects";
import Topics from "./pages/admin/Topics";
import Lessons from "./pages/admin/Lessons";
import Tests from "./pages/admin/Tests";
import Placeholder from "./pages/admin/Placeholder";
import Badges from "./pages/admin/Badges";
import Comments from "./pages/admin/Comments";
import FirebaseLogin from "./pages/admin/Login";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import Dashboard from "./pages/admin/Dasshboard";
import Ontap from "./pages/admin/Ontap";
import AddQuestionsPage from "./pages/admin/AddQuestionsPage";
// Protected Route Component
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminAuthChecker from "./components/common/AdminAuthChecker";

// Tạo router configuration
const router = createBrowserRouter([
  // --- Website cho học sinh ---
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/toan",
    element: <MathPage />,
  },
  {
    path: "/tieng-viet",
    element: <VietnamesePage />,
  },
  {
    path: "/kiem-tra/:grade",
    element: <ExamListPage />,
  },
  {
    path: "/kiem-tra/:examId/questions",
    element: <ExamQuestionPage />,
  },
  {
    path: "/huy-hieu",
    element: <HuyHieu />,
  },
  {
    path: "/doi-qua",
    element: <DoiQua />,
  },
  {
    path: "/trang-tri",
    element: <TrangTriCayThongPage />,
  },
  {
    path: "/xep-hang",
    element: <RankingPage />,
  },
  {
    path: "/dang-nhap",
    element: <LoginPage />,
  },
  {
    path: "/dang-ky",
    element: <RegisterPage />,
  },
  {
    path: "/quen-mat-khau",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/manage-profiles",
    element: <ManageProfiles />,
  },
  {
    path: "/thong-tin-ca-nhan",
    element: <ProfilePage />,
  },
  {
    path: "/ai-question",
    element: <AIQuestionPage />,
  },
  {
    path: "/loginAdmin",
    element: <FirebaseLogin />,
  },
  {
    path: "/admin-forgot-password",
    element: <AdminForgotPassword />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // --- Admin ---
  {
    path: "/admin",
    element: (
      <AdminAuthChecker>
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      </AdminAuthChecker>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "mon-hoc",
        element: <Subjects />,
      },
      {
        path: "chu-de",
        element: <Topics />,
      },
      {
        path: "bai-hoc",
        element: <Lessons />,
      },
      {
        path: "ontap",
        element: <Ontap />,
      },
      {
        path: "bai-kiem-tra",
        element: <Tests />,
      },
      {
        path: "huy-hieu",
        element: <Badges />,
      },
      {
        path: "binh-luan",
        element: <Comments />,
      },
      {
        path: "add-questions",
        element: <AddQuestionsPage />,
      },
      {
        path: "them-cau-hoi/:examId",
        element: <AddQuestionsPage />,
      },
      {
        path: "sua-cau-hoi/:examId/:questionId",
        element: <AddQuestionsPage />,
      },
    ],
  },
]);

function AppRoutes() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default AppRoutes;
