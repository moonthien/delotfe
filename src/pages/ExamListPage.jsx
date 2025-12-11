import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSubjectsByGrade,
  getExamsBySubject,
  getTopicsBySubject,
} from "../services/apiService";
import { FaArrowRight } from "react-icons/fa";
import {
  PageWrapper,
  ContentRow,
  MainContent,
  SidebarWrapper,
  SidebarBlock,
  BlockTitle,
  BlockContent,
  TopicList,
  TopicItem,
  SubjectSection,
  SubjectName,
  PageTitle,
  SubjectCard,
  SubjectTitle,
  ExamList,
  ExamItem,
  ExamImage,
  ExamContent,
  ExamTitle,
  ExamDesc,
  ExamAction,
  ExamTypeBadge,
  RankingList,
  RankingItem,
  RankNumber,
  Avatar,
  RankInfo,
  RankName,
  RankTime,
  RankScore,
} from "./styles/ExamListPage.styles";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { GlobalStyle } from "./styles/HomePage.styles";

function ExamListPage() {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [examsBySubject, setExamsBySubject] = useState({});
  const [topicsBySubject, setTopicsBySubject] = useState({});

  const rankingData = [
    {
      stt: 1,
      name: "Lê Nguyễn Bảo Anh",
      time: "198 Phút 27 Giây",
      score: 25150,
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      stt: 2,
      name: "Lê Minh Nhật",
      time: "1200 Phút 6 Giây",
      score: 25150,
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      stt: 3,
      name: "Khoai Lang",
      time: "2647 Phút 13 Giây",
      score: 25125,
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      stt: 4,
      name: "Nguyễn Ngọc Diệp",
      time: "2319 Phút 48 Giây",
      score: 25115,
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      stt: 5,
      name: "Phan Công Vinh",
      time: "461 Phút 8 Giây",
      score: 25000,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsRes = await getSubjectsByGrade(grade);
        const subjectsData = subjectsRes.data?.data || subjectsRes;
        setSubjects(subjectsData);

        const examsMap = {};
        const topicsMap = {};
        for (const subject of subjectsData) {
          const examsRes = await getExamsBySubject(subject._id);
          examsMap[subject._id] = examsRes.data?.data || examsRes;

          const topicsRes = await getTopicsBySubject(subject._id);
          topicsMap[subject._id] = topicsRes.data?.data || topicsRes;
        }
        setExamsBySubject(examsMap);
        setTopicsBySubject(topicsMap);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu ExamListPage:", err);
      }
    };
    if (grade) fetchData();
  }, [grade]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có ngày thi";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderExamTypeBadge = (type) => {
    const colors = {
      "15 phút": "#4caf50",
      "45 phút": "#ff9800",
      "Giữa kỳ": "#2196f3",
      "Cuối kỳ": "#f44336",
      tháng: "#9c27b0",
    };
    return <ExamTypeBadge color={colors[type]}>{type}</ExamTypeBadge>;
  };

  return (
    <>
      <GlobalStyle />
      <Header />
      <PageWrapper>
        <PageTitle>Danh sách bài kiểm tra - Lớp {grade}</PageTitle>

        <ContentRow>
          {/* Main Content */}
          <MainContent>
            {subjects.length === 0 ? (
              <p>Không tìm thấy môn học cho lớp {grade}</p>
            ) : (
              subjects.map((subject) => (
                <SubjectCard key={subject._id}>
                  <SubjectTitle>{subject.name}</SubjectTitle>
                  {examsBySubject[subject._id] &&
                  examsBySubject[subject._id].length > 0 ? (
                    <ExamList>
                      {examsBySubject[subject._id].map((exam) => (
                        <ExamItem key={exam._id}>
                          <ExamImage>
                            <img src="/assets/tree.jpg" alt="exam" />
                          </ExamImage>

                          <ExamContent>
                            <ExamTitle>
                              {renderExamTypeBadge(exam.examType)}
                              {/* {renderExamTypeBadge(exam.examType)} -{" "} */}
                              {/* <span>{formatDate(exam.date)}</span> */}
                            </ExamTitle>
                            <ExamDesc>{exam.description}</ExamDesc>
                          </ExamContent>

                          <ExamAction
                            onClick={() =>
                              navigate(`/kiem-tra/${exam._id}/questions`, {
                                state: { startExam: true },
                              })
                            }
                          >
                            <FaArrowRight />
                          </ExamAction>
                        </ExamItem>
                      ))}
                    </ExamList>
                  ) : (
                    <p>Chưa có bài kiểm tra nào cho môn này</p>
                  )}
                </SubjectCard>
              ))
            )}
          </MainContent>

          {/* Right Column chứa 2 SidebarBlock */}
          <SidebarWrapper>
            {/* Ranking Block */}
            <SidebarBlock>
              <BlockTitle>Bảng Xếp Hạng</BlockTitle>
              <BlockContent>
                <RankingList>
                  {rankingData.map((rank) => (
                    <RankingItem key={rank.stt}>
                      <RankNumber>{rank.stt}</RankNumber>
                      <Avatar>
                        <img src={rank.avatar} alt={rank.name} />
                      </Avatar>
                      <RankInfo>
                        <RankName>{rank.name}</RankName>
                        <RankTime>{rank.time}</RankTime>
                      </RankInfo>
                      <RankScore>{rank.score.toLocaleString()}</RankScore>
                    </RankingItem>
                  ))}
                </RankingList>
              </BlockContent>
            </SidebarBlock>

            {/* Review Block */}
            <SidebarBlock>
              <BlockTitle>Ôn tập theo môn học</BlockTitle>
              <BlockContent>
                {subjects.length > 0 ? (
                  subjects.map(
                    (subject) =>
                      topicsBySubject[subject._id]?.length > 0 && (
                        <SubjectSection key={subject._id}>
                          <SubjectName>
                            {subject.name} - Lớp {grade}
                          </SubjectName>
                          <TopicList>
                            {topicsBySubject[subject._id].map((topic) => (
                              <TopicItem key={topic._id}>
                                {topic.title}
                              </TopicItem>
                            ))}
                          </TopicList>
                        </SubjectSection>
                      )
                  )
                ) : (
                  <p style={{ fontSize: "14px", color: "#777" }}>
                    Chưa có chủ đề nào
                  </p>
                )}
              </BlockContent>
            </SidebarBlock>
          </SidebarWrapper>
        </ContentRow>
      </PageWrapper>
      <Footer />
    </>
  );
}

export default ExamListPage;
