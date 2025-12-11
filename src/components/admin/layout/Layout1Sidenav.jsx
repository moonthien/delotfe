import { memo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ChevronDown, ChevronRight } from "lucide-react";

// Constants
const sideNavWidth = "250px";
const themeShadows = {
  8: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
};

// STYLED COMPONENTS
const SidebarNavRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isVisible" && prop !== "isMobile",
})`
  position: fixed;
  top: 0;
  left: ${({ isVisible }) => (isVisible ? "0" : `-${sideNavWidth}`)};
  height: 100vh;
  width: ${sideNavWidth};
  box-shadow: ${themeShadows[8]};
  background: linear-gradient(135deg, #2d1b69 0%, #1a0d4f 35%, #0f0624 100%);
  backdrop-filter: blur(20px);
  z-index: ${({ isMobile }) =>
    isMobile ? 1100 : 1000}; /* Mobile cao hơn topbar */
  overflow: hidden;
  color: white;
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavListBox = styled.div`
  height: 100%;
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
`;

const Brand = styled.div`
  height: 64px;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    135deg,
    rgba(45, 27, 105, 0.95) 0%,
    rgba(26, 13, 79, 0.95) 50%,
    rgba(15, 6, 36, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  z-index: 1001;
  transition: all 300ms ease;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  color: #2d1b69;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15);
  }
`;

const Menu = styled.nav`
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Spacing đều giữa các menu items */
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #8c70cce7 0%, #8c65ceff 100%)"
      : "transparent"};
  box-shadow: ${(props) =>
    props.active
      ? "0 4px 16px rgba(139, 92, 246, 0.4), 0 2px 4px rgba(139, 92, 246, 0.2)"
      : "none"};
  border: ${(props) =>
    props.active
      ? "1px solid rgba(139, 92, 246, 0.3)"
      : "1px solid transparent"};

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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 600ms ease;
  }

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(135deg, #ab73e08d 0%, #8b5cf6 100%)"
        : "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)"};
    transform: translateX(4px) scale(1.02);
    color: white;
    box-shadow: ${(props) =>
      props.active
        ? "0 6px 20px rgba(139, 92, 246, 0.5), 0 3px 8px rgba(139, 92, 246, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(255, 255, 255, 0.1)"};
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &:hover::before {
    left: 100%;
  }

  .icon {
    font-size: 20px;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  .label {
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.025em;
    transition: all 300ms ease;
  }
`;

const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  cursor: pointer;
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, #8c70cce7 0%, #8c65ceff 100%)"
      : "transparent"};
  box-shadow: ${(props) =>
    props.active
      ? "0 4px 16px rgba(139, 92, 246, 0.4), 0 2px 4px rgba(139, 92, 246, 0.2)"
      : "none"};
  border: ${(props) =>
    props.active
      ? "1px solid rgba(139, 92, 246, 0.3)"
      : "1px solid transparent"};

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
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 600ms ease;
  }

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(135deg, #ab73e08d 0%, #8b5cf6 100%)"
        : "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)"};
    transform: translateX(4px) scale(1.02);
    color: white;
    box-shadow: ${(props) =>
      props.active
        ? "0 6px 20px rgba(139, 92, 246, 0.5), 0 3px 8px rgba(139, 92, 246, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(255, 255, 255, 0.1)"};
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &:hover::before {
    left: 100%;
  }

  .icon {
    font-size: 20px;
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  .label {
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.025em;
    transition: all 300ms ease;
    flex: 1;
  }

  .chevron {
    font-size: 16px;
    transition: transform 300ms ease;
    transform: ${(props) =>
      props.expanded ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

const SubmenuContainer = styled.div`
  max-height: ${(props) => (props.expanded ? "400px" : "0")};
  overflow: hidden;
  transition: all 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 4px;
`;

const SubmenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 12px 50px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 300ms ease;
  border-radius: 8px;
  margin: 2px 8px;
  background: ${(props) =>
    props.active
      ? "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)"
      : "transparent"};

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    color: white;
    transform: translateX(4px);
  }

  .icon {
    font-size: 16px;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    font-size: 14px;
    font-weight: 400;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin: 16px;
  margin-top: auto; /* Đẩy logout button xuống cuối */
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    transform: translateX(2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .icon {
    font-size: 18px;
    min-width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Layout1Sidenav = ({
  menuItems = [],
  onLogout,
  currentPath,
  isVisible = true,
  isMobile = false,
  onMenuClick,
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const toggleSubmenu = (itemTo) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [itemTo]: !prev[itemTo],
    }));
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some((subItem) => currentPath === subItem.to);
  };

  const renderMenuItem = (item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.to];
    const isActive = hasSubmenu
      ? isSubmenuActive(item.submenu)
      : currentPath === item.to;

    if (hasSubmenu) {
      return (
        <MenuItemContainer key={item.to}>
          <MainMenuItem
            active={isActive ? 1 : 0}
            expanded={isExpanded}
            onClick={() => toggleSubmenu(item.to)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
            <span className="chevron">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          </MainMenuItem>
          <SubmenuContainer expanded={isExpanded}>
            {item.submenu.map((subItem) => (
              <SubmenuItem
                key={subItem.to}
                to={subItem.to}
                active={currentPath === subItem.to ? 1 : 0}
                onClick={onMenuClick}
              >
                <span className="icon">{subItem.icon}</span>
                <span className="label">{subItem.label}</span>
              </SubmenuItem>
            ))}
          </SubmenuContainer>
        </MenuItemContainer>
      );
    }

    return (
      <MenuItem
        key={item.to}
        to={item.to}
        active={isActive ? 1 : 0}
        onClick={onMenuClick}
      >
        <span className="icon">{item.icon}</span>
        <span className="label">{item.label}</span>
      </MenuItem>
    );
  };

  return (
    <SidebarNavRoot isVisible={isVisible} isMobile={isMobile}>
      <Brand>
        <LogoContainer>
          <LogoIcon>AE</LogoIcon>
          <span>Athena Education</span>
        </LogoContainer>
      </Brand>

      <NavListBox>
        <Menu>{menuItems.map((item) => renderMenuItem(item))}</Menu>

        <LogoutButton onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span>Đăng xuất</span>
        </LogoutButton>
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default memo(Layout1Sidenav);
