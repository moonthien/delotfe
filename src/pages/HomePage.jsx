import React, { useState, useEffect } from "react";
import { useInView } from "../hooks/useInView";
import {
  GlobalStyle,
  HeroSection,
  HeroText,
  HeroIcons,
  IconBubble,
  CTAButton,
  TitleChar,
  StatsSection,
  StatsTitle,
  StatsContainer,
  StatItem,
  RankingSection,
  RankingTitle,
  RankingPodium,
  PodiumItem,
  RankingList,
  RankingFiltersCustom,
  WhyChooseSection,
  TabMenu,
  WhyChooseContent,
  WhyChooseImage,
  WhyChooseWrapper,
  BalloonImage,
  BalloonImageLeft,
  BalloonImageBottom,
} from "./styles/HomePage.styles";

import heroBg1 from "../assets/testbg.png";
import heroBg2 from "../assets/testbg2.png";
import heroBg3 from "../assets/bgr4.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CountUp from "../components/CountUp";

import bookIcon from "../assets/book.png";
import cupIcon from "../assets/cup.png";
import desktopIcon from "../assets/desktop.png";
import flagIcon from "../assets/flag.png";

import platform2 from "../assets/rank2.png";
import platform1 from "../assets/rank1.png";
import platform3 from "../assets/rank3.png";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";
import avatar3 from "../assets/avatar3.jpg";

import parentImg from "../assets/parent.png";
import studentImg from "../assets/student.png";
import teacherImg from "../assets/teacher.png";
import iconReport from "../assets/report.png";
import iconTime from "../assets/time.png";
import iconSupport from "../assets/support.png";
import iconMoney from "../assets/money.png";
import iconAward from "../assets/award.png";
import iconTravel from "../assets/travel.png";
import iconLearn from "../assets/learn.png";
import iconBadges from "../assets/badges.png";
import iconDocument from "../assets/document.png";
import iconImprove from "../assets/improve.png";
import iconInteract from "../assets/interact.png";
import balloonImg from "../assets/balloon1.png";
import balloonImg2 from "../assets/balloon2.png";
import balloonImg3 from "../assets/balloon3.png";
function HomePage() {
  const [openStates, setOpenStates] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [activeTab, setActiveTab] = useState("Phụ huynh");

  // Hero slides: mỗi slide gồm ảnh, tiêu đề, mô tả, nút
  const heroSlides = [
    {
      img: heroBg1,
      title: "Khám phá thế giới\nhọc tập thú vị",
      desc: "Ôn luyện kiến thức, tham gia trò chơi, giải đố, bài tập vui nhộn. Tất cả chỉ trong một nền tảng! Học mà chơi, chơi mà học!",
      button: "Học thử ngay",
    },
    {
      img: heroBg2,
      title: "Luyện trí thông minh\nđể phát triển tư duy",
      desc: "Khám phá những bài toán vui đầy hấp dẫn, nơi bạn có thể rèn luyện trí tuệ, kích thích tư duy sáng tạo và phát triển khả năng suy luận logic một cách tự nhiên.",
      button: "Khám phá ngay",
    },
    {
      img: heroBg3,
      title: "Sáng tạo không giới\nhạn phát triển tư duy",
      desc: "Tham gia vào những hoạt động sáng tạo đa dạng, nơi bạn được trải nghiệm học qua dự án thực tế và khám phá tiềm năng bản thân.",
      button: "Bắt đầu học",
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const [heroRef, heroVisible] = useInView();
  const [statsRef, statsVisible] = useInView();
  const [rankingRef, rankingVisible] = useInView();
  const [whyRef, whyVisible] = useInView();

  const filterOptions = [
    ["TP Hồ Chí Minh"],
    ["Quận 12"],
    ["Khối 6"],
    ["Tổng hợp"],
    ["Vòng sơ loại"],
  ];

  const toggleOpen = (index) => {
    setOpenStates((prev) =>
      prev.map((state, i) => (i === index ? !state : false))
    );
  };

  // Đóng tất cả khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenStates([false, false, false, false, false]);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const tabData = {
    "Phụ huynh": {
      img: parentImg,
      items: [
        {
          icon: iconReport,
          title: "Báo cáo trực quan",
          desc: "Nhận báo cáo chi tiết hàng ngày về điểm mạnh, điểm yếu và kết quả học tập của con.",
        },
        {
          icon: iconTime,
          title: "Tiết kiệm thời gian",
          desc: "Tiết kiệm thời gian khi con tự giác, chủ động và tiến bộ trong học tập.",
        },
        {
          icon: iconSupport,
          title: "Hỗ trợ kèm con học",
          desc: "Sử dụng học liệu, lộ trình gợi ý và phân tích để hỗ trợ con học hiệu quả.",
        },
        {
          icon: iconMoney,
          title: "Tiết kiệm tài chính",
          desc: "Giảm áp lực học thêm, tiết kiệm chi phí học tập.",
        },
      ],
    },
    "Học sinh": {
      img: studentImg,
      items: [
        {
          icon: iconLearn,
          title: "Học mọi lúc, mọi nơi",
          desc: "Học tập linh hoạt trên điện thoại, máy tính bảng và máy tính, bất cứ khi nào bạn muốn.",
        },
        {
          icon: iconTravel,
          title: "Lộ trình cá nhân hóa",
          desc: "Hệ thống tự động gợi ý lộ trình học phù hợp với khả năng và mục tiêu của bạn.",
        },
        {
          icon: iconBadges,
          title: "Tích điểm xếp hạng",
          desc: "Tham gia các cuộc thi, trò chơi học tập thú vị và so tài với bạn bè khắp nơi.",
        },
        {
          icon: iconAward,
          title: "Tăng hưng thú học tập",
          desc: "Vừa học vừa chơi qua các trò chơi tương tác, video sinh động và phần thưởng hấp dẫn.",
        },
      ],
    },
    "Giáo viên": {
      img: teacherImg,
      items: [
        {
          icon: iconDocument,
          title: "Quản lý lớp học dễ dàng",
          desc: "Theo dõi tiến độ học tập và kết quả của từng học sinh.",
        },
        {
          icon: iconTime,
          title: "Tiết kiệm thời gian soạn bài",
          desc: "Sử dụng kho học liệu có sẵn và bài giảng trực quan.",
        },
        {
          icon: iconInteract,
          title: "Tương tác linh hoạt",
          desc: "Tương tác trực tiếp với học sinh qua hệ thống.",
        },
        {
          icon: iconImprove,
          title: "Nâng cao hiệu quả dạy học",
          desc: "Áp dụng công nghệ để tăng hiệu quả và hứng thú học tập.",
        },
      ],
    },
  };

  return (
    <>
      <GlobalStyle />

      <main>
        <HeroSection
          ref={heroRef}
          style={{ backgroundImage: `url(${heroSlides[heroIndex].img})` }}
        >
          <Header />

          <HeroText
            style={{
              transform: heroVisible ? "translateX(0)" : "translateX(-50px)",
              opacity: heroVisible ? 1 : 0,
              transition: "all 0.8s ease",
            }}
          >
            <h1>
              {heroSlides[heroIndex].title
                .split("\n")
                .map((line, lineIndex) => (
                  <div key={`line-${heroIndex}-${lineIndex}`}>
                    {line.split("").map((ch, i) => (
                      <TitleChar
                        key={`${heroIndex}-${lineIndex}-${i}-${ch}`}
                        style={{
                          animationDelay: `${
                            (lineIndex * line.length + i) * 35
                          }ms`,
                        }}
                      >
                        {ch}
                      </TitleChar>
                    ))}
                  </div>
                ))}
            </h1>
            <p>{heroSlides[heroIndex].desc}</p>
            <CTAButton>{heroSlides[heroIndex].button}</CTAButton>
          </HeroText>
          <HeroIcons>
            <IconBubble>
              <img src={bookIcon} alt="Học tập" />
            </IconBubble>
            <IconBubble>
              <img src={desktopIcon} alt="Thi trực tuyến" />
            </IconBubble>
            <IconBubble>
              <img src={iconLearn} alt="Lộ trình học" />
            </IconBubble>
            <IconBubble>
              <img src={iconAward} alt="Thành tích" />
            </IconBubble>
          </HeroIcons>
          {/* Dot indicator */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 24,
            }}
          >
            {heroSlides.map((_, idx) => (
              <span
                key={idx}
                style={{
                  width: 16,
                  marginBottom: 10,
                  height: 16,
                  borderRadius: "50%",
                  background: idx === heroIndex ? "#29b6f6" : "#fff",
                  boxShadow: "0 0 2px #888",
                  transition: "background 0.3s",
                  display: "inline-block",
                  cursor: "pointer",
                  border:
                    idx === heroIndex ? "2px solid #29b6f6" : "2px solid #fff",
                }}
                onClick={() => setHeroIndex(idx)}
              />
            ))}
          </div>
        </HeroSection>

        <StatsSection ref={statsRef}>
          <StatsTitle
            style={{
              transform: statsVisible ? "translateY(0)" : "translateY(50px)",
              opacity: statsVisible ? 1 : 0,
              transition: "all 0.8s ease",
            }}
          >
            Trợ lý học tập thông minh
          </StatsTitle>
          <StatsContainer
            style={{
              transform: statsVisible ? "translateY(0)" : "translateY(50px)",
              opacity: statsVisible ? 1 : 0,
              transition: "all 0.8s ease",
            }}
          >
            <StatItem>
              <div className="icon-wrapper">
                <img src={cupIcon} alt="Hơn 96%" />
              </div>
              <h3>
                Hơn{" "}
                <CountUp end={96} duration={2500} startWhen={statsVisible} />%
              </h3>
              <p>
                Hơn 96% học sinh tiến bộ rõ rệt và yêu thích, tự giác học tập
              </p>
            </StatItem>
            <StatItem>
              <div className="icon-wrapper">
                <img src={flagIcon} alt="Chính xác 95%" />
              </div>
              <h3>
                Chính xác{" "}
                <CountUp end={95} duration={2500} startWhen={statsVisible} />%
              </h3>
              <p>Gợi ý lộ trình học cá nhân hoá</p>
            </StatItem>
            <StatItem>
              <div className="icon-wrapper">
                <img src={bookIcon} alt="1,000,000++" />
              </div>
              <h3>
                <CountUp
                  end={1000000}
                  duration={2500}
                  startWhen={statsVisible}
                />
                ++
              </h3>
              <p>1,000,000++ nội dung kiến thức theo SGK và nâng cao</p>
            </StatItem>
            <StatItem>
              <div className="icon-wrapper">
                <img src={desktopIcon} alt="10 triệu học sinh" />
              </div>
              <h3>
                <CountUp
                  end={10000000}
                  duration={2500}
                  startWhen={statsVisible}
                />
              </h3>
              <p>10 triệu học sinh yêu thích và tiến bộ</p>
            </StatItem>
          </StatsContainer>
        </StatsSection>

        <RankingSection ref={rankingRef}>
          <BalloonImage src={balloonImg} alt="Balloon Right" />
          <BalloonImageLeft src={balloonImg2} alt="Balloon Left" />
          <BalloonImageBottom src={balloonImg3} alt="Balloon Bottom" />
          <RankingTitle
            style={{
              transform: rankingVisible ? "translateY(0)" : "translateY(50px)",
              opacity: rankingVisible ? 1 : 0,
              transition: "all 0.8s ease",
            }}
          >
            Bảng xếp hạng
          </RankingTitle>
          <RankingFiltersCustom
            style={{
              transform: rankingVisible ? "translateY(0)" : "translateY(50px)",
              opacity: rankingVisible ? 1 : 0,
              transition: "all 0.8s ease",
            }}
          >
            {filterOptions.map((opts, idx) => (
              <div
                key={idx}
                className={`custom-select ${openStates[idx] ? "open" : ""}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  toggleOpen(idx);
                }}
              >
                <select onClick={(e) => e.stopPropagation()}>
                  {opts.map((o, i) => (
                    <option key={i}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </RankingFiltersCustom>
          <RankingPodium>
            <PodiumItem
              className={`rank2 ${rankingVisible ? "rank-visible" : ""}`}
            >
              <img className="avatar" src={avatar2} alt="Hạng 2" />
              <div>Trường Nhật Minh</div>
              <small>Trường THCS Trần Quang Khải</small>
              <div className="platform">
                <img src={platform2} alt="2" />
              </div>
            </PodiumItem>
            <PodiumItem
              className={`rank1 ${rankingVisible ? "rank-visible" : ""}`}
            >
              <img className="avatar" src={avatar1} alt="Hạng 1" />
              <div>Nguyễn Hoàng Quân</div>
              <small>Trường THCS An Phú Đông</small>
              <div className="platform">
                <img src={platform1} alt="1" />
              </div>
            </PodiumItem>
            <PodiumItem
              className={`rank3 ${rankingVisible ? "rank-visible" : ""}`}
            >
              <img className="avatar" src={avatar3} alt="Hạng 3" />
              <div>Nguyễn Thanh Anh Trúc</div>
              <small>Trường THCS Nguyễn Hiến</small>
              <div className="platform">
                <img src={platform3} alt="3" />
              </div>
            </PodiumItem>
          </RankingPodium>
          <RankingList>
            <li>
              <span className="rank-number">04</span>
              <img className="avatar" src={avatar1} alt="Phan Thị Kiều Chinh" />
              <div className="info">
                <span className="student-name">Phan Thị Kiều Chinh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">05</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">06</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">07</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">08</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">09</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
            <li>
              <span className="rank-number">10</span>
              <img
                className="avatar"
                src={avatar2}
                alt="Nguyễn Ngọc Trâm Anh"
              />
              <div className="info">
                <span className="student-name">Nguyễn Ngọc Trâm Anh</span>
                <span className="school-name">Trường THCS Nguyễn Công Trứ</span>
              </div>
            </li>
          </RankingList>
        </RankingSection>

        <WhyChooseSection
          ref={whyRef}
          style={{
            transform: whyVisible ? "translateY(0)" : "translateY(50px)",
            opacity: whyVisible ? 1 : 0,
            transition: "all 0.8s ease",
          }}
        >
          <h2
            style={{
              transform: whyVisible ? "translateY(0)" : "translateY(-50px)",
              opacity: whyVisible ? 1 : 0,
              transition: "all 1.1s ease",
            }}
          >
            Tại sao nên lựa chọn Athena Education
          </h2>
          <TabMenu>
            {Object.keys(tabData).map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </TabMenu>
          <WhyChooseWrapper>
            <WhyChooseImage>
              <img src={tabData[activeTab].img} alt={activeTab} />
            </WhyChooseImage>
            <WhyChooseContent>
              {tabData[activeTab].items.map((item, idx) => (
                <div className="item" key={idx}>
                  <img src={item.icon} alt={item.title} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </WhyChooseContent>
          </WhyChooseWrapper>
        </WhyChooseSection>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
