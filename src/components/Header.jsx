import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import addressIcon from "../assets/address.png";
import emailIcon from "../assets/email.png";
const HeaderWrapper = styled.header`
  padding: 0px 24px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  position: relative;
  z-index: 9999;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  min-height: 60px;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 15px;
  color: #333;
  font-family: "Montserrat-SemiBold", sans-serif;
  margin-right: 12px;
  .icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    vertical-align: middle;
    margin-right: 8px
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: 2%;
`;

const Logo = styled.img`
  max-height: 50px;
  object-fit: contain;
  margin-right: 8px;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const LoginButton = styled.button`
  background-color: #fff;
  color: #333;
  padding: 14px 32px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  font-family: "Montserrat-SemiBold", sans-serif;
`;

const SignupButton = styled.button`
  background-color: #00a1d6;
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  font-family: "Montserrat-SemiBold", sans-serif;
`;

const StudentInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
`;

const StudentAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const StudentDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Montserrat-SemiBold", sans-serif;

  .name {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  .class {
    font-size: 14px;
    color: #666;
  }
  .nuts {
    font-size: 14px;
    color: #666;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 5000;
  min-width: 180px;
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  font-family: "Montserrat-SemiBold", sans-serif;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(90deg, #f15a4f 0%, #f9a825 100%);
  border-radius: ${(props) => (props.$sticky ? "0" : "32px")};
  margin: ${(props) => (props.$sticky ? "0" : "0 auto")};
  width: ${(props) => (props.$sticky ? "100%" : "85%")};
  padding: 5px 0;
  position: ${(props) => (props.$sticky ? "fixed" : "relative")};
  top: ${(props) => (props.$sticky ? "0" : "auto")};
  left: ${(props) => (props.$sticky ? "0" : "auto")};
  right: ${(props) => (props.$sticky ? "0" : "auto")};
  z-index: ${(props) => (props.$sticky ? 4000 : 3000)};
  box-shadow: ${(props) =>
    props.$sticky ? "0 2px 8px rgba(0,0,0,0.15)" : "none"};
  font-family: "Montserrat-SemiBold", sans-serif;
  overflow: visible;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 992px) {
    gap: 2px;
  }
`;

const NavLinkStyled = styled.a`
  color: #000000ff;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
  padding: 0 24px;
  text-align: center;
  transition: background 0.2s, color 0.2s;
  height: 48px;
  line-height: 48px;
  display: flex;
  align-items: center;
  border-radius: 24px;
  box-sizing: border-box;
  letter-spacing: 1px;
  margin: 0 4px;
  &:hover,
  &.active {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }
  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  @media (max-width: 1200px) {
    font-size: 18px;
    padding: 0 20px;
    height: 44px;
    line-height: 44px;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 0 14px;
    height: 42px;
    line-height: 42px;
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover .arrow {
    transform: rotate(180deg);
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  min-width: 160px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 5000;

  ${DropdownWrapper}:hover & {
    display: block;
  }
`;

const DropdownLink = styled(Link)`
  color: #333;
  padding: 10px 15px;
  display: block;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  font-family: "Montserrat-SemiBold", sans-serif;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 6px;
  transition: transform 0.3s ease;
`;

const StickySpacer = styled.div`
  height: 58px; /* approx nav height (48px link + 10px padding) */
`;

function Header() {
  // dùng state để Header có thể re-render khi selectedStudent thay đổi
  const [selectedStudent, setSelectedStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("selectedStudent") || "null");
    } catch (e) {
      return null;
    }
  });

  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const topRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef(null);
  const navigate = useNavigate();

  // lắng nghe event toàn cục khi student thay đổi
  useEffect(() => {
    const handleStudentUpdate = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("selectedStudent") || "null");
        setSelectedStudent(updated);
      } catch (e) {
        setSelectedStudent(null);
      }
    };

    window.addEventListener("studentUpdated", handleStudentUpdate);

    // cũng lắng nghe storage change nếu có tab khác update localStorage
    const handleStorage = (e) => {
      if (e.key === "selectedStudent") {
        handleStudentUpdate();
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("studentUpdated", handleStudentUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { root: null, threshold: 0 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <HeaderWrapper>
      <TopSection ref={topRef}>
        <ContactInfo>
          <span className="item">
            <img src={addressIcon} className="icon" alt="help" />Chào mừng bạn đến với Athena Education
          </span>
          <span className="item">
            <img src={emailIcon} className="icon" alt="phone" />athenaeducation@gmail.com
          </span>
        </ContactInfo>

        {selectedStudent ? (
          <StudentInfoWrapper
            onClick={() => setMenuOpen(!menuOpen)}
            ref={menuRef}
            aria-label="Student menu"
            title={selectedStudent?.name || "Học sinh"}
          >
            <StudentAvatar
              src={
                selectedStudent.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              }
              alt={selectedStudent.name || "Avatar"}
            />
            <StudentDetails>
              <span className="name">{selectedStudent.name}</span>
              {selectedStudent.class && (
                <span className="class">Lớp {selectedStudent.class}</span>
              )}
              <span className="nuts" aria-live="polite">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/6267/6267035.png"
                  alt="nuts"
                  style={{
                    width: "14px",
                    height: "14px",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />
                {selectedStudent.nuts ?? 0}
              </span>
            </StudentDetails>
            {menuOpen && (
              <DropdownMenu role="menu" aria-label="Student dropdown">
                <MenuItem
                  onClick={() =>
                    navigate("/thong-tin-ca-nhan", {
                      state: { section: "profile" },
                    })
                  }
                >
                  <img
                    src="/assets/profile_14026766.png"
                    alt="Thông tin cá nhân"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    navigate("/trang-tri", {
                      state: { section: "profile" },
                    })
                  }
                >
                  <img
                    src="/assets/home-decor.png"
                    alt="Trang trí phần quà"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Trang trí phần quà
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <img
                    src="/assets/log-out_4113679.png"
                    alt="Đăng xuất"
                    style={{ width: "20px", height: "20px" }}
                  />
                  Đăng xuất
                </MenuItem>
              </DropdownMenu>
            )}
          </StudentInfoWrapper>
        ) : (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <AuthButtons>
              <Link to="/dang-nhap">
                <LoginButton>Đăng nhập</LoginButton>
              </Link>
              <Link to="/dang-ky">
                <SignupButton>Đăng ký</SignupButton>
              </Link>
            </AuthButtons>
          </div>
        )}
      </TopSection>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isSticky && <StickySpacer />}

      <Nav $sticky={isSticky} role="navigation" aria-label="Main navigation">
        <LogoContainer>
          <Link to="/" aria-label="Trang chủ">
            <Logo src="/logo.png" alt="Education.com Logo" />
          </Link>
        </LogoContainer>

        <NavLinks>
          <NavLinkStyled
            as={Link}
            to="/"
            className={currentPath === "/" ? "active" : ""}
          >
            Trang chủ
          </NavLinkStyled>
          <NavLinkStyled
            as={Link}
            to="/toan"
            className={currentPath.startsWith("/toan") ? "active" : ""}
          >
            Toán học
          </NavLinkStyled>
          <NavLinkStyled
            as={Link}
            to="/tieng-viet"
            className={currentPath.startsWith("/tieng-viet") ? "active" : ""}
          >
            Tiếng Việt
          </NavLinkStyled>
          <NavLinkStyled
            as={Link}
            to="/huy-hieu"
            className={currentPath.startsWith("/huy-hieu") ? "active" : ""}
          >
            Huy hiệu
          </NavLinkStyled>
          <NavLinkStyled
            as={Link}
            to="/doi-qua"
            className={currentPath.startsWith("/doi-qua") ? "active" : ""}
          >
            Đổi quà
          </NavLinkStyled>
          <NavLinkStyled
            as={Link}
            to="/xep-hang"
            className={currentPath.startsWith("/xep-hang") ? "active" : ""}
          >
            Xếp hạng
          </NavLinkStyled>

          <DropdownWrapper>
            <NavLinkStyled
              as="div"
              className={activeMenu === "kiem-tra" ? "active" : ""}
            >
              Kiểm tra
              <Arrow className="arrow">▾</Arrow>
            </NavLinkStyled>
            <DropdownContent>
              {[1, 2, 3, 4, 5].map((lop) => (
                <DropdownLink
                  key={lop}
                  to={`/kiem-tra/${lop}`}
                  onClick={() => setActiveMenu("kiem-tra")}
                >
                  Lớp {lop}
                </DropdownLink>
              ))}
            </DropdownContent>
          </DropdownWrapper>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
}

export default Header;
