import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  thongKeQuestions,
  thongkeLessons,
  thongkeTopics,
  exportdataExcel,
} from "../../services/apiService";
import {
  Users,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Award,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "react-toastify";

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
// Container chính
const DashboardContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const DashboardTitle = styled.h1`
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
    width: 80px;
    height: 3px;
    background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 100%);
    border-radius: 2px;
    opacity: 0.7;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
  position: relative;
  padding-left: 16px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`;

// Grid cho các thẻ thống kê
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  /* Đảm bảo hiển thị đẹp trên màn hình nhỏ */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* Hiển thị 2 cột trên tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Hiển thị 3 cột trên màn hình vừa */
  @media (min-width: 1025px) and (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Hiển thị 5 cột trên màn hình lớn */
  @media (min-width: 1441px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

// Thẻ thống kê
const StatCard = styled.div`
  background: ${(props) =>
    props.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  border-radius: 20px;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='25' cy='25' r='2'/%3E%3Ccircle cx='45' cy='45' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.positive ? "#ffffffff" : "#64748b")};
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const StatTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  opacity: 0.9;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`;

// Grid cho biểu đồ
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Container biểu đồ
const ChartContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const ChartSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
`;

const ExportSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(156, 163, 175, 0.2);
  }
`;

const Dashboard = () => {
  const [statsLoading, setStatsLoading] = useState(true);
  const [questionsStats, setQuestionsStats] = useState(null);
  const [lessonsStats, setLessonsStats] = useState(null);
  const [topicsStats, setTopicsStats] = useState(null);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch statistics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [questionsRes, lessonsRes, topicsRes] = await Promise.all([
          thongKeQuestions(),
          thongkeLessons(),
          thongkeTopics(),
        ]);

        setQuestionsStats(questionsRes.data?.data || questionsRes.data);
        setLessonsStats(lessonsRes.data?.data || lessonsRes.data);
        setTopicsStats(topicsRes.data?.data || topicsRes.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle export data
  const handleExportData = async () => {
    try {
      setIsExporting(true);

      const response = await exportdataExcel();

      // Create blob from response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `backup-data-${currentDate}.xlsx`);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

       toast.success("Dữ liệu đã được xuất thành công!");
    } catch (error) {
      console.error("❌ Lỗi export data:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu";
      alert(`Lỗi: ${errorMessage}`);
      toast.error(`Lỗi: ${errorMessage}`, {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Generate stats data from API responses
  const getStatsData = () => {
    if (statsLoading || !questionsStats || !lessonsStats || !topicsStats) {
      return [
        {
          title: "Tổng số chủ đề",
          value: "...",
          trend: "...",
          positive: true,
          icon: <GraduationCap />,
          gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        },
        {
          title: "Tổng số bài học",
          value: "...",
          trend: "...",
          positive: true,
          icon: <BookOpen />,
          gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        },
        {
          title: "Tổng số câu hỏi",
          value: "...",
          trend: "...",
          positive: true,
          icon: <MessageCircle />,
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          title: "Câu hỏi ôn tập",
          value: "...",
          trend: "...",
          positive: true,
          icon: <Award />,
          gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        },
        {
          title: "Câu hỏi kiểm tra",
          value: "...",
          trend: "...",
          positive: true,
          icon: <Users />,
          gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        },
      ];
    }

    return [
      {
        title: "Tổng số chủ đề",
        value:
          topicsStats?.total?.toLocaleString() ||
          lessonsStats.byTopic?.length?.toLocaleString() ||
          "0",
        trend: `${topicsStats?.bySubject?.length || 0} môn học`,
        positive: true,
        icon: <GraduationCap />,
        gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
      {
        title: "Tổng số bài học",
        value: lessonsStats.total?.toLocaleString() || "0",
        trend: `${lessonsStats.byTopic?.length || 0} chủ đề `,
        positive: true,
        icon: <BookOpen />,
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
      {
        title: "Tổng số câu hỏi",
        value: questionsStats.overview?.totalQuestions?.toLocaleString() || "0",
        trend: `${questionsStats.overview?.totalQuestionSets || 0} bộ câu hỏi`,
        positive: true,
        icon: <MessageCircle />,
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      {
        title: "Câu hỏi ôn tập",
        value:
          questionsStats.byType?.lesson?.questions?.toLocaleString() || "0",
        trend: `${questionsStats.byType?.lesson?.questionSets || 0} bộ câu hỏi`,
        positive: true,
        icon: <Award />,
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
      {
        title: "Câu hỏi kiểm tra",
        value: questionsStats.byType?.exam?.questions?.toLocaleString() || "0",
        trend: `${questionsStats.byType?.exam?.questionSets || 0} bộ câu hỏi`,
        positive: true,
        icon: <Users />,
        gradient: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      },
    ];
  };

  // Generate topics chart data
  const getTopicsChartData = () => {
    if (!topicsStats?.bySubject && !lessonsStats?.byTopic) return [];

    const colors = [
      "#667eea",
      "#4facfe",
      "#43e97b",
      "#f093fb",
      "#ff9a9e",
      "#a8edea",
    ];

    // Sử dụng topicsStats nếu có, nếu không thì dùng lessonsStats
    if (topicsStats?.bySubject) {
      return topicsStats.bySubject.slice(0, 6).map((subject, index) => ({
        name: subject.subjectName || subject.name,
        value: subject.topicCount || subject.count,
        color: colors[index % colors.length],
      }));
    }

    // Fallback: Group unique topics từ lessons data
    const topicsBySubject = {};
    lessonsStats.byTopic?.forEach((lesson) => {
      const subjectName = lesson.topicId?.subjectId?.name || "Không xác định";
      const topicTitle = lesson.topicId?.title;

      if (!topicsBySubject[subjectName]) {
        topicsBySubject[subjectName] = new Set();
      }
      if (topicTitle) {
        topicsBySubject[subjectName].add(topicTitle);
      }
    });

    return Object.entries(topicsBySubject)
      .slice(0, 6)
      .map(([name, topicsSet], index) => ({
        name,
        value: topicsSet.size,
        color: colors[index % colors.length],
      }));
  };

  const getLessonsChartData = () => {
    if (!lessonsStats?.byTopic) return [];

    // Group by subject và đếm lessons + topics
    const subjectMap = {};
    lessonsStats.byTopic.forEach((lesson) => {
      const subjectName = lesson.topicId?.subjectId?.name || "Không xác định";
      const topicTitle = lesson.topicId?.title || "Không xác định";

      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          lessons: 0,
          topics: new Set(),
        };
      }

      subjectMap[subjectName].lessons++;
      subjectMap[subjectName].topics.add(topicTitle);
    });

    return Object.entries(subjectMap)
      .slice(0, 6)
      .map(([subject, data]) => ({
        subject,
        lessons: data.lessons,
        topics: data.topics.size,
      }));
  };

  const getQuestionsLevelData = () => {
    if (!questionsStats?.byType) return [];

    const colors = {
      exam: "#ef4444",
      lesson: "#43e97b",
    };

    const typeNames = {
      exam: "Exam",
      lesson: "Lesson",
    };

    return Object.entries(questionsStats.byType).map(([type, data]) => ({
      name: typeNames[type] || type,
      value: data.questions || 0,
      color: colors[type] || "#64748b",
    }));
  };

  if (error) {
    return (
      <DashboardContainer>
        <DashboardTitle>
          <span className="icon">⚠️</span>
          <span className="text">Lỗi tải dữ liệu</span>
        </DashboardTitle>
        <div style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>
          {error}
        </div>
      </DashboardContainer>
    );
  }

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <DashboardTitle>
          <span className="icon">👋</span>
          <span className="text">Hi, Welcome back</span>
        </DashboardTitle>

        {/* Phần tải dữ liệu */}
        <ExportSection>
          <ExportButton onClick={handleExportData} disabled={isExporting}>
            {isExporting ? (
              <>
                <span>⏳</span>
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>📊</span>
                <span>Tải toàn bộ dữ liệu</span>
              </>
            )}
          </ExportButton>
        </ExportSection>

        {/* Phần thống kê tổng quan */}
        <SectionTitle>📊 Thống kê tổng quan</SectionTitle>
        <StatsGrid>
          {getStatsData().map((stat, index) => (
            <StatCard key={index} gradient={stat.gradient}>
              <StatHeader>
                <StatIcon>{stat.icon}</StatIcon>
                <StatTrend positive={stat.positive}>{stat.trend}</StatTrend>
              </StatHeader>
              <StatTitle>{stat.title}</StatTitle>
              <StatValue>{stat.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>
        {/* Phần báo cáo nâng cao */}
        <SectionTitle>🎯 Báo cáo nâng cao</SectionTitle>
        <ChartsGrid>
          {/* Biểu đồ câu hỏi theo cấp độ */}
          <ChartContainer>
            <ChartTitle>Phân bố câu hỏi theo loại</ChartTitle>
            <ChartSubtitle>Số lượng câu hỏi Exam và Lesson</ChartSubtitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getQuestionsLevelData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getQuestionsLevelData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Số câu hỏi"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartsGrid>

        {/* Phần thống kê chi tiết theo loại */}
        <SectionTitle>📊 Thống kê chi tiết theo loại</SectionTitle>
        <ChartsGrid>
          {/* Biểu đồ so sánh Question Sets và Questions */}
          <ChartContainer>
            <ChartTitle>So sánh Lesson vs Exam</ChartTitle>
            <ChartSubtitle>Bộ câu hỏi và câu hỏi theo từng loại</ChartSubtitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    type: "Lesson",
                    questionSets:
                      questionsStats?.byType?.lesson?.questionSets || 0,
                    questions: questionsStats?.byType?.lesson?.questions || 0,
                  },
                  {
                    type: "Exam",
                    questionSets:
                      questionsStats?.byType?.exam?.questionSets || 0,
                    questions: questionsStats?.byType?.exam?.questions || 0,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Số lượng",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="questionSets"
                  fill="#667eea"
                  radius={[4, 4, 0, 0]}
                  name="Bộ câu hỏi"
                />
                <Bar
                  dataKey="questions"
                  fill="#4facfe"
                  radius={[4, 4, 0, 0]}
                  name="Câu hỏi"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Biểu đồ tròn phân bố Question Sets */}
          <ChartContainer>
            <ChartTitle>Phân bố bộ câu hỏi</ChartTitle>
            <ChartSubtitle>Tỷ lệ bộ câu hỏi Lesson và Exam</ChartSubtitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Lesson Question Sets",
                      value: questionsStats?.byType?.lesson?.questionSets || 0,
                      color: "#43e97b",
                    },
                    {
                      name: "Exam Question Sets",
                      value: questionsStats?.byType?.exam?.questionSets || 0,
                      color: "#ef4444",
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#43e97b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Số bộ câu hỏi"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartsGrid>

        {/* Phần báo cáo nâng cao */}
        <SectionTitle>🎯 Báo cáo nâng cao</SectionTitle>
        <ChartsGrid>
          {/* Biểu đồ thống kê tổng hợp */}
          <ChartContainer>
            <ChartTitle>Thống kê tổng hợp hệ thống</ChartTitle>
            <ChartSubtitle>Tổng quan về nội dung giáo dục</ChartSubtitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    category: "Chủ đề",
                    count:
                      topicsStats?.total || lessonsStats?.byTopic?.length || 0,
                    fill: "#667eea",
                  },
                  {
                    category: "Bài học",
                    count: lessonsStats?.total || 0,
                    fill: "#4facfe",
                  },
                  {
                    category: "Câu hỏi",
                    count: questionsStats?.overview?.totalQuestions || 0,
                    fill: "#43e97b",
                  },
                  {
                    category: "Bộ câu hỏi",
                    count: questionsStats?.overview?.totalQuestionSets || 0,
                    fill: "#f093fb",
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Số lượng",
                  ]}
                />
                <Bar dataKey="count" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartsGrid>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
