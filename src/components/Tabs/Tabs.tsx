import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Wrapper 전체 wrap 스타일 정의
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// TabWrapper 컴포넌트 스타일 정의
const TabWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: calc(100% - 40px);
  margin: 0 auto;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: 100px;
  overflow: hidden;
  box-shadow: ${({ theme }) => `0 1px 4px 1px ${theme.colors.gray300}`};
`;

// Tab 컴포넌트 스타일 정의
const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.gray900 : theme.colors.gray700};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : 'transparent'};
  font-family: ${({ $isActive }) =>
    $isActive ? "'NanumSquareBold' !important" : 'NanumSquare'};
  box-shadow: ${({ $isActive, theme }) =>
    $isActive ? `0 2px 10px 1px ${theme.colors.gray400}` : 'none'};
  font-size: 1.2rem;
  border-radius: 100px;
  cursor: pointer;
  transition: 0.2s;

  &:focus {
    outline: none;
  }
  &:hover {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.white : theme.colors.gray200};
  }
`;

// TabPanel 컴포넌트 스타일 정의(콘텐츠 레이아웃 정의)
const TabPanel = styled.div`
  width: 100%;
  margin: 20px auto 120px;
`;

// TabItem 타입 정의
interface TabItem {
  label: string;
  path: string;
}

// TabsProps 타입 정의
interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = tabs.findIndex(tab => {
    const regex = new RegExp(`^${tab.path}(/|$)`);
    return regex.test(location.pathname);
  });

  const onClickTab = (path: string) => {
    navigate(path);
  };

  return (
    <Wrapper>
      <TabWrapper>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            $isActive={activeIndex === index}
            onClick={() => onClickTab(tab.path)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabWrapper>
      <TabPanel>
        <Outlet />
      </TabPanel>
    </Wrapper>
  );
};

export default Tabs;
