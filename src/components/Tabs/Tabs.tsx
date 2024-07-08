import React, { useState } from 'react';
import styled from 'styled-components';

/*
 *const tabs = [
    {
      label: '대시보드',
      content: <div>Tab 1 Content</div>,
    },
    {
      label: '운동 기록',
      content: <div>Tab 2 Content</div>,
    },
    {
      label: '식단 관리',
      content: <div>Tab 3 Content</div>,
    },
  ];
 *<Tabs tabs={tabs} />
*/

// TabWrapper 컴포넌트 스타일 정의
const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 5px;
  background-color: ${(props) => props.theme.colors.gray100};
  border-radius: 100px;
  overflow: hidden;
  box-shadow: ${(props) => `0 1px 4px 1px ${props.theme.colors.gray300}`};
`;

// Tab 컴포넌트 스타일 정의
const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  color: ${({ isActive, theme }) => (isActive ? theme.colors.gray900 : theme.colors.gray700)};
  background: ${({ isActive, theme }) => (isActive ? theme.colors.white : 'transparent')};
  font-family: ${({ isActive }) => (isActive ? "'NanumSquareBold' !important" : 'NanumSquare')};
  box-shadow: ${({ isActive, theme }) =>
    isActive ? `0 2px 10px 1px ${theme.colors.gray400}` : 'none'};
  font-size: 1.2rem;
  border-radius: 100px;
  cursor: pointer;
  transition: 0.2s;

  &:focus {
    outline: none;
  }
  &:hover {
    background: ${({ isActive, theme }) => (isActive ? theme.colors.white : theme.colors.gray200)};
  }
`;

// TabPanel 컴포넌트 스타일 정의
const TabPanel = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
`;

// TabItem 타입 정의
interface TabItem {
  label: string;
  content: React.ReactNode;
}

// TabsProps 타입 정의
interface TabsProps {
  tabs: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <TabWrapper>
        {tabs.map((tab, index) => (
          <Tab key={index} isActive={activeIndex === index} onClick={() => setActiveIndex(index)}>
            {tab.label}
          </Tab>
        ))}
      </TabWrapper>
      <TabPanel>{tabs[activeIndex].content}</TabPanel>
    </div>
  );
};

export default Tabs;
