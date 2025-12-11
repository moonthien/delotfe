import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  FaBars,
  FaEnvelope,
  FaGlobe,
  FaStar,
  FaHome,
  FaUser,
  FaCog,
  FaPowerOff,
  FaSearch,
  FaBell,
} from "react-icons/fa";
import { logout } from "../../../redux/slice/adminAuthSlice";
import { toast } from "react-toastify";

const topBarHeight = "64px";

// STYLED COMPONENTS
const StyledIconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 400ms ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:hover::before {
    left: 100%;
  }

  svg {
    font-size: 20px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }
`;

const TopbarRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "sidebarWidth",
})`
  position: fixed;
  top: 0;
  left: ${({ sidebarWidth }) =>
    sidebarWidth === "0px" ? "0px" : sidebarWidth || "250px"};
  right: 0;
  z-index: 96;
  height: ${topBarHeight};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopbarContainer = styled.div`
  padding: 8px 20px 8px 18px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #4338ca 100%);
  backdrop-filter: blur(20px);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 14px 8px 14px;
  }
`;

const UserMenu = styled.div`
  padding: 4px;
  display: flex;
  border-radius: 24px;
  cursor: pointer;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  span {
    margin: 0 8px;
    color: white;
  }
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  min-width: 185px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  a {
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  span {
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.87);
  }

  svg {
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.54);
  }
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 960px) {
    display: none !important;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchBox = styled.div`
  position: relative;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px 16px 12px 44px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 14px;
  width: 280px;
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  transition: all 300ms ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  z-index: 2;
  pointer-events: none;
`;

const NotificationButton = styled(StyledIconButton)`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    background: #ff4444;
    border-radius: 50%;
  }
`;

const DropdownMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`;

const Layout1Topbar = ({ sidebarWidth = "250px", onSidebarToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy thông tin admin từ Redux
  const { adminInfo } = useSelector((state) => state.adminAuth);

  // Lấy thông tin user để hiển thị
  const user = {
    name:
      adminInfo?.username ||
      adminInfo?.name ||
      adminInfo?.email ||
      "Admin User",
    avatar: adminInfo?.avatar || "https://i.pravatar.cc/150?img=3",
  };

  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đã đăng xuất thành công!");
    navigate("/loginAdmin");
  };

  return (
    <TopbarRoot sidebarWidth={sidebarWidth}>
      <TopbarContainer>
        <FlexBox>
          <StyledIconButton onClick={handleSidebarToggle}>
            <FaBars />
          </StyledIconButton>

          <IconBox>
            <StyledIconButton>
              <FaEnvelope />
            </StyledIconButton>

            <StyledIconButton>
              <FaGlobe />
            </StyledIconButton>

            <StyledIconButton>
              <FaStar />
            </StyledIconButton>
          </IconBox>
        </FlexBox>

        <FlexBox>
          <SearchBox>
            <SearchIcon />
            <SearchInput placeholder="Search..." />
          </SearchBox>

          <NotificationButton>
            <FaBell />
          </NotificationButton>

          <DropdownMenu>
            <UserMenu onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span>
                Hi <strong>{user.name}</strong>
              </span>
              <img
                src={user.avatar}
                alt="Avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            </UserMenu>

            <DropdownContent isOpen={isMenuOpen}>
              <StyledItem>
                <Link to="/">
                  <FaHome />
                  <span>Home</span>
                </Link>
              </StyledItem>

              <StyledItem onClick={handleLogout}>
                <FaPowerOff />
                <span>Logout</span>
              </StyledItem>
            </DropdownContent>
          </DropdownMenu>
        </FlexBox>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
