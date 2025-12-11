import styled from "styled-components";

export const PageWrapper = styled.main`
  padding: 20px;
  font-family: "Montserrat-SemiBold", sans-serif;
`;

export const ContentRow = styled.div`
  display: flex;
  gap: 20px;
`;

export const MainContent = styled.div`
  flex: 3;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

/* -------- Sidebar Wrapper -------- */
export const SidebarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* -------- Generic Sidebar Block -------- */
export const SidebarBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BlockTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #2e2e2e;
`;

export const BlockContent = styled.aside`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  max-height: 400px;
`;

/* -------- Subject / Review styles -------- */
export const TopicList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const TopicItem = styled.li`
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

export const SubjectSection = styled.div`
  margin-bottom: 16px;
`;

export const SubjectName = styled.h4`
  margin-bottom: 8px;
  color: #333;
`;

export const PageTitle = styled.h1`
  font-family: "Impress", sans-serif;
  font-size: 32px;
  margin-bottom: 24px;
  color: #2e2e2e;
`;

export const SubjectCard = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const SubjectTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 12px;
  color: #333;
`;

/* -------- Exam styles -------- */
export const ExamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ExamItem = styled.li`
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-bottom: 1px solid #eee;
  gap: 16px;
`;

export const ExamImage = styled.div`
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ExamContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ExamTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ExamDesc = styled.div`
  font-size: 13px;
  color: #666;
`;

export const ExamAction = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #2196f3;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(3px);
  }
`;

export const ExamTypeBadge = styled.span`
  background-color: ${(props) => props.color || "#777"};
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

/* -------- Ranking styles -------- */
export const RankingList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const RankingItem = styled.li`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

export const RankNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2196f3;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  overflow: hidden;
  margin-right: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RankInfo = styled.div`
  flex: 1;
`;

export const RankName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const RankTime = styled.div`
  font-size: 12px;
  color: #777;
`;

export const RankScore = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #e53935;
  margin-left: auto;
`;
