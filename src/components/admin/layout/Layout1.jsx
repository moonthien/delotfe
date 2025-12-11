import { useEffect, memo, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Layout1Topbar from "./Layout1Topbar";
import Layout1Sidenav from "./Layout1Sidenav";
// Constants for sidebar widths
const sideNavWidth = "250px";
const sidenavCompactWidth = "80px";

// STYLED COMPONENTS
const Layout1Root = styled.div`
  display: flex;
  background: ${({ theme }) =>
    theme?.palette?.background?.default || "#f5f5f5"};
`;

const StyledScrollBar = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const LayoutContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "width" && prop !== "hasFixedTopbar",
})`
  height: 100vh;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  vertical-align: top;
  margin-left: ${({ width }) => width || "0px"};
  padding-top: ${({ hasFixedTopbar }) => (hasFixedTopbar ? "64px" : "0px")};
  position: relative;
  overflow: hidden;
  transition: all 350ms cubic-bezier(0.4, 0, 0.2, 1);
`;

// Styled replacement for Material-UI Box
const FlexBox = styled.div`
  flex-grow: 1;
  position: relative;
`;

// Mobile overlay backdrop
const MobileOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isVisible",
})`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  cursor: pointer;

  @media (min-width: 769px) {
    display: none; /* Chỉ hiện trên mobile */
  }
`;

// Custom hook to replace Material-UI useMediaQuery
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

const Layout1 = ({ menuItems, onLogout, currentPath }) => {
  const isMdScreen = useMediaQuery("(max-width: 768px)");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Simplified settings - chỉ giữ những gì cần thiết
  const sidenavMode = "full";
  const showSidenav = true;

  const getSidenavWidth = () => {
    switch (sidenavMode) {
      case "full":
        return sideNavWidth;

      case "compact":
        return sidenavCompactWidth;

      default:
        return "0px";
    }
  };

  // Mobile: sidebar ẩn mặc định, chỉ hiện khi toggle
  // Desktop: sidebar hiện mặc định, có thể toggle
  const actualSidenavWidth = sidebarCollapsed ? "0px" : getSidenavWidth();
  const actualShowSidenav = isMdScreen
    ? !sidebarCollapsed
    : sidebarCollapsed
    ? false
    : showSidenav;
  const actualSidenavMode = sidebarCollapsed ? "close" : sidenavMode;

  const layoutClasses = `theme-light`;

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMdScreen) {
      setSidebarCollapsed(true);
    }
  }, [isMdScreen]);

  const handleOverlayClick = () => {
    if (isMdScreen && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <Layout1Root className={layoutClasses}>
      {/* Mobile overlay backdrop */}
      <MobileOverlay
        isVisible={isMdScreen && !sidebarCollapsed}
        onClick={handleOverlayClick}
      />

      <Layout1Sidenav
        menuItems={menuItems}
        onLogout={onLogout}
        currentPath={currentPath}
        isVisible={actualShowSidenav && actualSidenavMode !== "close"}
        isMobile={isMdScreen}
        onMenuClick={() => isMdScreen && setSidebarCollapsed(true)}
      />

      <LayoutContainer width={actualSidenavWidth} hasFixedTopbar={true}>
        <Layout1Topbar
          sidebarWidth={actualSidenavWidth}
          onSidebarToggle={handleSidebarToggle}
          fixed={true}
          className="elevation-z8"
        />

        <StyledScrollBar>
          <FlexBox>
            <Outlet />
          </FlexBox>
        </StyledScrollBar>
      </LayoutContainer>
    </Layout1Root>
  );
};

export default memo(Layout1);
