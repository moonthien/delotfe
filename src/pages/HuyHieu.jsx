import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalStyle } from "./styles/HomePage.styles";
import {
  PageWrapper,
  PageTitle,
  TabMenu,
  BadgeGrid,
  BadgeCard,
  ProgressBarContainer,
  ProgressBar,
  FireworkEffect,
  Tooltip,
  NutsReward,
  NutsRewardIcon,
} from "./styles/HuyHieu.styles";
import { getAllBadges, getBadgesByStudent } from "../services/apiService";
import API from "../services/api";

function HuyHieu() {
  const [activeTab, setActiveTab] = useState("chuyencan");
  const [groupedBadges, setGroupedBadges] = useState({});
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const student = JSON.parse(localStorage.getItem("selectedStudent"));
  const studentId = student?._id || student?.id;

  // 🧠 Tạo text mô tả điều kiện mở khóa
  // const getConditionText = (condition) => {
  //   if (!condition) return "Chưa rõ điều kiện";
  //   const { type, value, subject } = condition;

  //   switch (type) {
  //     case "days_in_row":
  //       return `Học liên tục ${value} ngày`;
  //     case "exercises_done":
  //       return `Hoàn thành ${value} bài ${
  //         subject === "any" ? "bất kỳ" : subject
  //       }`;
  //     case "score":
  //       return `Đạt ${value} điểm trong bài kiểm tra`;
  //     case "speed":
  //       return `Hoàn thành bài trong ${value} giây`;
  //     default:
  //       return "Chưa rõ điều kiện";
  //   }
  // };
  const getConditionText = (badge) => {
    if (!badge || !badge.description) return "Chưa rõ điều kiện";
    return badge.description;
  };

  // 🧮 Tính toán phần còn lại để hiển thị tooltip
  const getRemainingConditionText = (badge) => {
    const { condition, progress } = badge;
    if (!condition || !progress) return getConditionText(condition);

    const remaining = Math.max(
      (condition.value || 0) - (progress.currentValue || 0),
      0
    );

    switch (condition.type) {
      case "days_in_row":
        return remaining === 0
          ? "Sắp đạt rồi!"
          : `Còn ${remaining} ngày để mở khóa`;
      case "exercises_done":
        return remaining === 0
          ? "Sắp đạt rồi!"
          : `Còn ${remaining} bài để đạt huy hiệu`;
      case "score":
        return `Cần đạt ${condition.value} điểm trong bài kiểm tra`;
      case "speed":
        return `Hoàn thành bài trong ${condition.value} giây`;
      default:
        return "Chưa rõ điều kiện";
    }
  };

  useEffect(() => {
    if (!studentId) return;

    const fetchBadges = async () => {
      try {
        setLoading(true);

        const allRes = await getAllBadges();
        const allBadges = allRes.data?.data?.badges || [];

        const studentRes = await getBadgesByStudent(studentId);
        const studentBadges = studentRes.data?.data?.badges || [];
        const earnedIds = studentBadges.map(
          (b) => b.badgeId?._id || b.badgeId
        );

        const processed = await Promise.all(
          allBadges.map(async (badge) => {
            let unlocked = earnedIds.includes(badge._id);
            let progress = null;
            let newUnlocked = false;

            if (!unlocked) {
              try {
                const res = await API.get(
                  `/students/${studentId}/badges/${badge._id}/progress`
                );
                progress = res.data?.data?.progress || null;

                if (
                  progress?.isCompleted === true ||
                  progress?.progressPercentage === 100
                ) {
                  await API.post(
                    `/students/${studentId}/badges/check-and-award`
                  );

                  unlocked = true;
                  newUnlocked = true;
                  setCelebrating(true);
                  setTimeout(() => setCelebrating(false), 3000);

                  // 🌰🔥 Cộng hạt dẻ khi mở khóa huy hiệu mới
                  if (badge.rewardNuts) {
                    try {
                      const selectedStudent = JSON.parse(
                        localStorage.getItem("selectedStudent")
                      );
                      const newNuts =
                        (selectedStudent?.nuts || 0) + (badge.rewardNuts || 0);
                      const updatedStudent = {
                        ...selectedStudent,
                        nuts: newNuts,
                      };
                      localStorage.setItem(
                        "selectedStudent",
                        JSON.stringify(updatedStudent)
                      );
                      window.dispatchEvent(new Event("studentUpdated"));
                      console.log(
                        `🏅 Nhận huy hiệu "${badge.title}" +${badge.rewardNuts} 🌰`
                      );
                    } catch (err) {
                      console.error("⚠️ Lỗi khi cộng hạt dẻ huy hiệu:", err);
                    }
                  }
                }
              } catch (err) {
                console.warn("Lỗi lấy tiến độ:", err);
              }
            }

            return { ...badge, unlocked, progress, newUnlocked };
          })
        );

        const grouped = processed.reduce((acc, badge) => {
          if (!acc[badge.category]) acc[badge.category] = [];
          acc[badge.category].push(badge);
          return acc;
        }, {});

        setGroupedBadges(grouped);
      } catch (err) {
        console.error("Lỗi tải huy hiệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [studentId]);

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Header />
        <PageWrapper>
          <PageTitle>Đang tải huy hiệu...</PageTitle>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  const tabLabels = {
    chuyencan: "Huy hiệu chuyên cần",
    soluong: "Huy hiệu số lượng bài làm",
    dacbiet: "Huy hiệu đặc biệt",
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <PageWrapper>
        <PageTitle>DANH SÁCH HUY HIỆU</PageTitle>

        <TabMenu>
          {Object.keys(tabLabels).map((key) => (
            <button
              key={key}
              className={activeTab === key ? "active" : ""}
              onClick={() => setActiveTab(key)}
            >
              {tabLabels[key]}
            </button>
          ))}
        </TabMenu>

        <BadgeGrid>
          {groupedBadges[activeTab]?.length > 0 ? (
            groupedBadges[activeTab].map((badge) => (
              <BadgeCard
                key={badge._id}
                unlocked={badge.unlocked}
                newUnlocked={badge.newUnlocked}
                onMouseEnter={() => !badge.unlocked && setHoveredBadge(badge)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                <NutsReward>
                  +{badge.rewardNuts}
                  <NutsRewardIcon className="nuts-icon" src="https://cdn-icons-png.flaticon.com/512/6267/6267035.png" alt="Nuts" />
                </NutsReward>
                {badge.newUnlocked && <FireworkEffect />}
                <img
                  src={
                    badge.unlocked
                      ? badge.icon
                      : "https://cdn-icons-png.flaticon.com/512/61/61457.png"
                  }
                  alt={badge.title}
                />
                <h3>{badge.title}</h3>
                <p>
                  {badge.unlocked
                    ? badge.description
                    : getConditionText(badge)}
                </p>

                {!badge.unlocked && badge.progress && (
                  <ProgressBarContainer>
                    <ProgressBar
                      data-percent={badge.progress.progressPercentage}
                    />
                    <span>
                      {badge.progress.currentValue}/{badge.progress.targetValue}
                    </span>
                  </ProgressBarContainer>
                )}

                {/* Tooltip hiển thị khi hover */}
                {!badge.unlocked &&
                  hoveredBadge?._id === badge._id &&
                  badge.progress && (
                    <Tooltip>{getRemainingConditionText(badge)}</Tooltip>
                  )}
              </BadgeCard>
            ))
          ) : (
            <p>Không có huy hiệu nào trong nhóm này.</p>
          )}
        </BadgeGrid>

        {celebrating && (
          <div className="celebration-overlay">
            <FireworkEffect big />
          </div>
        )}
      </PageWrapper>
      <Footer />
    </>
  );
}

export default HuyHieu;
