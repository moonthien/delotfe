import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, createGlobalStyle, css } from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiSettings, FiMusic, FiVolumeX } from "react-icons/fi";
import { CustomDragLayer, DraggableDecoration, DropZone } from "../components/TreeDecorations/DraggableDecoration";
import ConfirmModal from "../components/TreeDecorations/ConfirmModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// --- Hình ảnh ---
import treeImg from "../assets/tree.png";
import treeImg2 from "../assets/treeSnow.png";
import treeFan from "../assets/treeFantasy.png";
import treeMor from "../assets/treeModern.png";
import bgImage from "../assets/christmas_bg.png";
import christmasMusic from "../assets/christmas.mp3";
import dropSound from "../assets/ting.mp3";

// Thêm import:
import { getExchangedRewards, getTreeByStudentId, addTreeDecoration, removeTreeDecoration, clearAllTreeDecorations, updateTreeLayout } from "../services/apiService";
import { getTreeDecorationsByLayout } from "../services/apiService";

/* ====== Global style ====== */
export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Nunito';
    src: url('/fonts/Nunito-Medium.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

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
    font-family: 'Open Sans', sans-serif;

    /* Ẩn thanh cuộn nhưng vẫn cho phép cuộn */
    -ms-overflow-style: none;  /* IE & Edge */
    scrollbar-width: none;     /* Firefox */
  }

  /* Chrome, Safari */
  ::-webkit-scrollbar {
    display: none;
  }
`;

/* ====== Hiệu ứng tuyết ====== */
const snow = keyframes`
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(10px) rotate(180deg);
    opacity: 0.9;
  }
  100% {
    transform: translateY(100vh) translateX(-10px) rotate(360deg);
    opacity: 0;
  }
`;

/* ====== Wrapper (giống ProfilePage) ====== */
export const Wrapper = styled.div`
  display: flex;
  padding: 8px 130px;
  gap: 20px;
  padding-bottom: 30px;
`;

/* ====== Sidebar ====== */
const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const StudentName = styled.h3`
  font-size: 18px;
  margin: 5px 0;
  color: #666;
`;

const StudentClass = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
`;

const RewardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  img {
    width: 45px;
    height: 45px;
    object-fit: contain;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 18px;
  color: #056674;
  margin-bottom: 15px;
  text-align: center;
`;

const ShelfContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  position: relative;

  /* Hiệu ứng ánh sáng lung linh phía sau */
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at 50% 30%,
      rgba(255, 248, 200, 0.4),
      transparent 80%
    );
    filter: blur(25px);
    z-index: 0;
    animation: twinkle 5s infinite alternate ease-in-out;
  }

  @keyframes twinkle {
    0% {
      opacity: 0.7;
      transform: scale(1);
    }
    100% {
      opacity: 1;
      transform: scale(1.05);
    }
  }
`;

const ShelfRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;

  /* Thanh kệ bằng gỗ có ánh sáng vàng nhẹ */
  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 5%;
    width: 90%;
    height: 14px;
    background: linear-gradient(to bottom, #d6a976, #b37a4c);
    border-radius: 8px;
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.3),
      0 -1px 5px rgba(255, 230, 150, 0.5) inset;
  }
`;

const ShelfItem = styled.div`
  position: relative;
  text-align: center;
  min-width: 60px;
  transition: transform 0.2s ease, filter 0.3s;
  user-select: none;

  &:hover {
    transform: translateY(-6px) scale(1.05);
    filter: drop-shadow(0 0 10px rgba(255, 230, 150, 0.6));
  }

  img {
    width: 55px;
    height: 55px;
    object-fit: contain;
    cursor: grab;
    transition: transform 0.2s;
  }

  p {
    font-size: 12px;
    color: #333;
    margin-top: 5px;
    font-family: 'Nunito', sans-serif;
  }
`;

/* ====== Main content (gradient) ====== */
const rotateCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(180deg); }
`;

const rotateCCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-180deg); }
`;

const Content = styled.div`
  flex: 1;
  border-radius: 12px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  /* 🎨 Dùng ảnh nền */
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;

  /* Lớp phủ nhẹ giúp text nổi rõ hơn */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.45); /* phủ sáng nhẹ */
    z-index: 0;
  }

  /* Đảm bảo mọi nội dung trong Content nằm trên overlay */
  > * {
    position: relative;
    z-index: 1;
  }
`;

const TopLeftControls = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 10px; /* khoảng cách giữa 2 icon */
  z-index: 50;
`;

const SettingBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: 0.2s;

  animation: ${({$rotateDir}) =>
    $rotateDir === "cw"
      ? rotateCW
      : $rotateDir === "ccw"
      ? rotateCCW
      : "none"
  } 0.5s linear;

  &:hover {
    background: rgba(255,255,255,1);
    transform: scale(1.05);
  }
`;

const musicPulse = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(3deg); }
  50% { transform: scale(1) rotate(0deg); }
  75% { transform: scale(1.1) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const wave = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(2.3);
    opacity: 0.3;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
`;

const MusicBtn = styled.button`
  position: relative;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: ${({ $isPlaying }) =>
    $isPlaying ? "rgba(255, 80, 80, 0.9)" : "rgba(255,255,255,0.85)"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: 0.3s ease all;
  animation: ${({ $isPlaying }) => ($isPlaying ? css`${musicPulse} 1.8s infinite ease-in-out` : "none")};

  &:hover {
    background: ${({ $isPlaying }) =>
      $isPlaying ? "rgba(255, 100, 100, 1)" : "rgba(255,255,255,1)"};
    transform: scale(1.05);
  }

  svg {
    color: ${({ $isPlaying }) => ($isPlaying ? "white" : "#333")};
    transition: color 0.3s;
  }

  /* 🌊 Sóng lan tỏa khi nhạc phát */
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 200, 200, 0.2) 80%
    );
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
    pointer-events: none;
  }

  ${({ $isPlaying }) =>
    $isPlaying &&
    css`
      &::before {
        animation: ${wave} 2.4s infinite ease-out;
      }
      &::after {
        animation: ${wave} 2.4s infinite ease-out;
        animation-delay: 1.2s;
      }
    `}
`;

const SettingMenu = styled.div`
  position: absolute;
  top: 60px;   /* ngay dưới nút */
  left: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  overflow: hidden;
  width: 140px;
  z-index: 50;
`;

const SettingItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: 0.15s;

  &:hover {
    background: #f5f5f5;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  color: #056674;
  margin-bottom: 25px;
  text-align: center;
`;

const TreeContainer = styled.div`
  position: relative;
  width: 400px;
  height: 500px;

  /* 🎄 Thay đổi ảnh theo layout */
  background: ${({ $layout }) => {
    switch ($layout) {
      case "snow":
        return `url(${treeImg2}) no-repeat center`; // cây tuyết
      case "modern":
        return `url(${treeMor}) no-repeat center`; // nền sáng kiểu hiện đại
      case "fantasy":
        return `url(${treeFan}) no-repeat center`; // cây fantasy
      default:
        return `url(${treeImg}) no-repeat center`; // classic
    }
  }};

  background-size: contain;
  margin: 0 auto;
  transition: background 0.3s ease, transform 0.2s ease;

  &.shake {
    animation: shakeTree 0.3s ease;
  }

  @keyframes shakeTree {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(2deg); }
    50% { transform: rotate(-2deg); }
    75% { transform: rotate(1deg); }
    100% { transform: rotate(0deg); }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 25px;
  border: none;
  background-color: ${(props) => props.$bg || "#ff8c42"};
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.2s;

  &:hover {
    background-color: ${(props) => props.$hover || "#ff7043"};
  }
`;

const Snowflake = styled.div.attrs((props) => ({
  style: {
    left: `${props.$left}%`,
    width: `${props.$size}px`,
    height: `${props.$size}px`,
    animationDuration: `${props.$duration}s`,
    animationDelay: `${props.$delay}s`,
  },
}))`
  position: absolute;
  top: -10px;
  background: white;
  border-radius: 50%;
  opacity: 0.9;
  animation-name: ${snow};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

/* ====== Trang chính ====== */
const TrangTriCayThongPage = () => {
  const [placed, setPlaced] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [student, setStudent] = useState(null);
  const [decorations, setDecorations] = useState([]); // từ database
  const [openMenu, setOpenMenu] = useState(false);
  const [rotateDir, setRotateDir] = useState(null);
  const audioRef = useRef(null);
  const [allDecorations, setAllDecorations] = useState({});

  const selectedStudent = JSON.parse(localStorage.getItem("selectedStudent") || "null");
  const studentId = selectedStudent?._id || selectedStudent?.id;

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const dropPositions =
    student?.treeLayout === "snow"
      ? [
          { top: "35px", left: "162px" },
          { top: "272px", left: "168px" },
          { top: "157px", left: "105px" },
          { top: "154px", left: "222px" },
          { top: "298px", left: "280px" },
          { top: "294px", left: "32px" },
        ]
      : student?.treeLayout === "fantasy"
      ? [
          { top: "110px", left: "162px" },
          { top: "190px", left: "160px" },
          { top: "270px", left: "70px" },
          { top: "328px", left: "220px" },
        ]
      : student?.treeLayout === "modern"
      ? [
          { top: "94px", left: "127px" },
          { top: "167px", left: "219px" },
          { top: "240px", left: "147px" },
          { top: "262px", left: "66px" },
          { top: "334px", left: "164px" },
        ]
      : [
          { top: "20px", left: "163px" },
          { top: "158px", left: "108px" },
          { top: "150px", left: "236px" },
          { top: "280px", left: "54px" },
          { top: "258px", left: "166px" },
          { top: "280px", left: "270px" },
      ];

  const toggleMenu = () => {
    if (openMenu) {
      setRotateDir("ccw");
      setOpenMenu(false);
    } else {
      setRotateDir("cw");
      setOpenMenu(true);
    }
  };

  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        if (!studentId) return;
        const res = await getTreeByStudentId(studentId);
        const layout = res.data.treeLayout || "classic";
        setStudent((prev) => ({
          ...prev,
          treeLayout: layout,
        }));
        // ✅ Gọi luôn getTreeDecorationsByLayout để chắc chắn load đúng layout ban đầu
        const decoRes = await getTreeDecorationsByLayout(studentId, layout);
        setDecorations(decoRes.data.decorations || []);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin cây thông:", err);
      }
    };
    fetchTreeData();
  }, [studentId]);

  // 🔄 Lấy decorations của TẤT CẢ layout để biết phần quà nào đã dùng ở đâu
  useEffect(() => {
    const fetchAllDecorations = async () => {
      if (!studentId) return;
      const layouts = ["classic", "snow", "modern", "fantasy"];
      const result = {};
      for (const layout of layouts) {
        try {
          const res = await getTreeDecorationsByLayout(studentId, layout);
          result[layout] = res.data.decorations || [];
        } catch (err) {
          console.error(`⚠️ Lỗi lấy decorations cho layout ${layout}:`, err);
          result[layout] = [];
        }
      }
      setAllDecorations(result);
    };
    fetchAllDecorations();
  }, [studentId]);

  useEffect(() => {
    const fetchDecorations = async () => {
      if (!studentId || !student?.treeLayout) return;
      try {
        const res = await getTreeDecorationsByLayout(studentId, student.treeLayout);
        setDecorations(res.data.decorations || []);
      } catch (err) {
        console.error("❌ Lỗi lấy decorations theo layout:", err);
      }
    };
    fetchDecorations();
  }, [student?.treeLayout]); // 👈 mỗi khi layout đổi, tự lấy lại đúng decorations

  const dropSoundRef = useRef(new Audio(dropSound));

  const handleDrop = async (position, reward) => {
    try {
      // Lấy layout hiện tại từ DB để đảm bảo đúng
      const layoutNow = (await getTreeByStudentId(studentId)).data.treeLayout || "classic";

      // Dữ liệu gửi lên server
      const payload = {
        rewardId: reward.rewardId?._id || reward.rewardId,
        position: {
          x: parseInt(position.left),
          y: parseInt(position.top),
        },
        size: 1,
        rotation: 0,
        layout: layoutNow,
      };
      console.log("📦 Gửi dữ liệu addDecoration:", payload);
      // Hiển thị tạm vật trang trí trên giao diện
      setPlaced((prev) => ({ ...prev, [JSON.stringify(position)]: reward }));
      // Âm thanh "ting"
      if (dropSoundRef.current) {
        dropSoundRef.current.currentTime = 0;
        dropSoundRef.current.play().catch(() => {});
      }
      // Hiệu ứng rung cây thông
      const treeEl = document.querySelector(".tree-container");
      treeEl?.classList.add("shake");
      setTimeout(() => treeEl?.classList.remove("shake"), 300);
      // 🚀 Gửi dữ liệu lên backend
      const res = await addTreeDecoration(studentId, payload);
      console.log("✅ Kết quả backend:", res.data);
      // 🔄 Sau khi thêm, lấy lại decorations có populate ảnh
      const updated = await getTreeDecorationsByLayout(studentId, layoutNow);
      const newDecorations = updated.data.decorations || [];
      setDecorations(newDecorations);
      setPlaced({});

      // 🔁 Cập nhật lại allDecorations để Sidebar render lại ngay
      setAllDecorations((prev) => ({
        ...prev,
        [layoutNow]: newDecorations,
      }));
      console.log("🎄 Lưu trang trí thành công!");
    } catch (err) {
      console.error("❌ Lỗi lưu trang trí:", err.response?.data || err);
      alert(err.response?.data?.error || "Có lỗi khi lưu trang trí!");
    }
  };

  const handleRemoveDecoration = async (decorationId) => {
    if (!decorationId) return toast.error("Không tìm thấy ID vật trang trí để xóa!");

    setConfirmModal({
      show: true,
      message: "❌ Bạn có chắc muốn gỡ vật trang trí này không?",
      onConfirm: async () => {
        setConfirmModal({ show: false });
        try {
          await removeTreeDecoration(studentId, decorationId, student?.treeLayout);

          const updated = decorations.filter((d) => d._id !== decorationId);
          setDecorations(updated);

          // 🔁 cập nhật lại kệ quà
          const res = await getTreeDecorationsByLayout(studentId, student?.treeLayout);
          setAllDecorations((prev) => ({
            ...prev,
            [student?.treeLayout]: res.data.decorations || [],
          }));

          toast.success("🎁 Đã gỡ vật trang trí khỏi cây thông!");
        } catch (err) {
          console.error("❌ Lỗi khi xóa vật trang trí:", err);
          toast.error("Không thể xóa vật trang trí!");
        }
      },
    });
  };

  const resetTree = async () => {
    setConfirmModal({
      show: true,
      message: "⚠️ Bạn có chắc muốn xóa toàn bộ vật trang trí trên cây không?",
      onConfirm: async () => {
        setConfirmModal({ show: false });
        try {
          await clearAllTreeDecorations(studentId, student?.treeLayout);
          setDecorations([]);
          setPlaced({});
          setAllDecorations((prev) => ({
            ...prev,
            [student?.treeLayout]: [],
          }));
          toast.success("🎄 Cây thông đã được làm mới!");
        } catch (err) {
          console.error("❌ Lỗi khi làm mới cây thông:", err);
          toast.error("Không thể làm mới cây thông!");
        }
      },
    });
  };

  // 🎵 Bật/tắt nhạc có hiệu ứng fade out
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Giảm dần âm lượng khi tắt
      let vol = audio.volume;
      const fade = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          audio.volume = vol;
        } else {
          clearInterval(fade);
          audio.pause();
          audio.volume = 0.3; // reset âm lượng
          setIsPlaying(false);
        }
      }, 100);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Gọi API lấy thông tin học sinh + phần quà đã đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studentId) return;
        // 🪄 Gọi luôn API cây thông để lấy treeLayout
        const treeRes = await getTreeByStudentId(studentId);
        const layout = treeRes.data.treeLayout || "classic";
        // ✅ Gộp dữ liệu local + layout từ server
        setStudent({
          ...selectedStudent,
          treeLayout: layout,
        });
        // 🎁 Lấy danh sách phần quà
        const rewardRes = await getExchangedRewards(studentId);
        setRewards(rewardRes.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi lấy dữ liệu học sinh:", err);
      }
    };
    fetchData();
  }, [studentId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // 🔉 Giảm âm lượng xuống 30%
    }
  }, []);

  // 🔊 Tự động phát nhạc khi vào trang
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const tryPlay = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("⚠️ Trình duyệt chặn auto-play, người dùng cần click để bật nhạc");
        }
      };
      tryPlay();
    }
  }, []);

  const snowflakes = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 5 + 3, // nhỏ hơn để nhẹ nhàng hơn
    duration: Math.random() * 3 + 3, // nhanh hơn (3–6s)
    delay: Math.random() * 4, // delay ngắn hơn để tuyết rơi liên tục
  }));

  return (
    <>
      <GlobalStyle />
      <Header />
      <DndProvider backend={HTML5Backend}>
        <CustomDragLayer />
        <Wrapper>
          {/* Sidebar hiển thị avatar + phần quà */}
          <Sidebar>
            <Avatar
              src={
                student?.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
              alt={student?.name}
            />
            <StudentName>{student?.name || "Chưa có tên"}</StudentName>
            <StudentClass>Lớp {student?.class || "?"}</StudentClass>

            <SidebarTitle>🎁 Phần quà đang có 🎁</SidebarTitle>
            <ShelfContainer>
              {rewards.length > 0 ? (
                (() => {
                  const mergedRewards = Object.values(
                    rewards.reduce((acc, reward) => {
                      const id = reward.rewardId?._id || reward.rewardId;
                      if (!acc[id]) acc[id] = { ...reward, count: 1 };
                      else acc[id].count += 1;
                      return acc;
                    }, {})
                  );
                  // Cắt mảng thành từng “kệ”, mỗi kệ tối đa 3 phần quà
                  const shelves = [];
                  for (let i = 0; i < mergedRewards.length; i += 3) {
                    shelves.push(mergedRewards.slice(i, i + 3));
                  }

                  return shelves.map((shelf, index) => (
                    <ShelfRow key={index}>
                      {shelf.map((reward) => {
                        const rewardId = reward.rewardId?._id || reward.rewardId;
                        // 🧮 Tính tổng số phần quà đã dùng ở TẤT CẢ layout
                        const totalUsed = Object.values(allDecorations)
                          .flat()
                          .filter((d) => (d.rewardId?._id || d.rewardId) === rewardId).length;
                        const available = reward.count - totalUsed;
                        return (
                          <ShelfItem key={reward.rewardId?._id || reward._id}>
                            <DraggableDecoration reward={reward} disabled={available <= 0} />
                            {available > 1 && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "40px",
                                  right: "4px",
                                  background: "rgba(0,0,0,0.7)",
                                  color: "white",
                                  fontSize: "10px",
                                  borderRadius: "10px",
                                  padding: "1px 4px",
                                }}
                              >
                                x{available}
                              </div>
                            )}
                          </ShelfItem>
                        );
                      })}
                    </ShelfRow>
                  ));
                })()
              ) : (
                <p style={{ fontSize: "13px", color: "#777" }}>Chưa có phần quà nào</p>
              )}
            </ShelfContainer>
          </Sidebar>

          {/* Main content gradient */}
          <Content>
            <TopLeftControls>
              <SettingBtn onClick={toggleMenu} $rotateDir={rotateDir}>
                <FiSettings size={20} color="#333" />
              </SettingBtn>
              <MusicBtn onClick={toggleMusic} $isPlaying={isPlaying}>
                {isPlaying ? (
                  <FiVolumeX size={20} title="Tắt nhạc" />
                ) : (
                  <FiMusic size={20} title="Bật nhạc" />
                )}
              </MusicBtn>
            </TopLeftControls>
            {openMenu && (
              <SettingMenu>
                {["classic", "snow", "modern", "fantasy"].map((layout) => (
                  <SettingItem
                    key={layout}
                    onClick={async () => {
                      try {
                        await updateTreeLayout(studentId, layout);
                        // ✅ Cập nhật lại layout ngay để đổi hình
                        setStudent((prev) => ({ ...prev, treeLayout: layout }));
                        // 🔄 Lấy decorations đúng layout (có ảnh)
                        const res = await getTreeDecorationsByLayout(studentId, layout);
                        const decorationsNow = res.data.decorations || [];
                        setDecorations(decorationsNow);
                        // 🔁 Cập nhật lại toàn bộ allDecorations sau khi đổi cây
                        setAllDecorations((prev) => ({ ...prev, [layout]: decorationsNow }));
                        toast.success(`🎄 Đã chuyển sang cây thông "${layout}"!`, {
                          position: "top-center",
                          autoClose: 2500,
                        });
                        setOpenMenu(false);
                      } catch (err) {
                        console.error("❌ Lỗi khi đổi layout:", err);
                        alert("Đổi layout thất bại!");
                      }
                    }}
                  >
                    {layout.charAt(0).toUpperCase() + layout.slice(1)}
                  </SettingItem>
                ))}
              </SettingMenu>
            )}
            {snowflakes.map((flake) => (
              <Snowflake
                key={flake.id}
                $left={flake.left}
                $size={flake.size}
                $duration={flake.duration}
                $delay={flake.delay}
              />
            ))}

            <Title>🎄 Trang trí cây thông Noel 🎁</Title>

            <TreeContainer className="tree-container" $layout={student?.treeLayout}>
              {/* 1️⃣ Hiển thị tất cả decorations đã lưu từ backend */}
              {decorations.map((d) => (
                <DropZone
                  key={d._id}
                  position={{ top: `${d.position.y}px`, left: `${d.position.x}px` }}
                  placedItem={d}
                  onDrop={handleDrop}
                  onRemove={handleRemoveDecoration}
                />
              ))}
              
              {/* 2️⃣ Hiển thị các vị trí trống cho phép thả mới */}
              {dropPositions.map((pos, idx) => {
                const occupied = decorations.some(
                  (d) =>
                    Math.abs(d.position.x - parseInt(pos.left)) < 10 &&
                    Math.abs(d.position.y - parseInt(pos.top)) < 10
                );
                if (occupied || placed[JSON.stringify(pos)]) return null;
                return (
                  <DropZone
                    key={`empty-${idx}-${student?.treeLayout}`} 
                    position={pos}
                    placedItem={placed[JSON.stringify(pos)]}
                    onDrop={handleDrop}
                    onRemove={handleRemoveDecoration}
                  />
                );
              })}
            </TreeContainer>
            
            <ButtonRow>
              <Button onClick={resetTree} $bg="#ff8c42" $hover="#ff7043">
                🔁 Làm mới cây thông
              </Button>
            </ButtonRow>

            <audio ref={audioRef} src={christmasMusic} />
          </Content>
        </Wrapper>
        <ConfirmModal
          show={confirmModal.show}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ show: false })}
        />
        <ToastContainer />
      </DndProvider>
      <Footer />
    </>
  );
};

export default TrangTriCayThongPage;