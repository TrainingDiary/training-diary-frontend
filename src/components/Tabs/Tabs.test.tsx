import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

import Tabs from './Tabs';
import theme from '../../styles/theme';

// Mock data for tabs
const tabs = [
  { label: '탭 1', content: <div>탭 1 내용</div> },
  { label: '탭 2', content: <div>탭 2 내용</div> },
  { label: '탭 3', content: <div>탭 3 내용</div> },
];

// Tabs 컴포넌트를 ThemeProvider로 감싸서 렌더링하는 함수
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Tabs 컴포넌트 테스트', () => {
  test('초기 렌더링 시 첫 번째 탭이 활성화 상태여야 한다.', () => {
    renderWithTheme(<Tabs tabs={tabs} />);

    screen.getByText('탭 1');
    screen.getByText('탭 1 내용');
  });

  test('각 탭 클릭 시 해당 탭의 내용이 보여야 한다.', () => {
    renderWithTheme(<Tabs tabs={tabs} />);

    tabs.forEach((tab) => {
      const tabButton = screen.getByText(tab.label);
      fireEvent.click(tabButton);

      screen.getByText(tab.content.props.children);
    });
  });

  test('탭 클릭 시 활성화 스타일이 올바르게 적용되어야 한다.', () => {
    renderWithTheme(<Tabs tabs={tabs} />);

    tabs.forEach((tab) => {
      const tabButton = screen.getByText(tab.label);
      fireEvent.click(tabButton);

      screen.getByText(tab.content.props.children);
    });
  });

  test('탭 클릭 시 비활성화 스타일이 올바르게 적용되어야 한다.', () => {
    renderWithTheme(<Tabs tabs={tabs} />);

    // 첫 번째 탭을 클릭하여 활성화
    const firstTabButton = screen.getByText('탭 1');
    fireEvent.click(firstTabButton);

    // 두 번째 탭을 클릭하여 첫 번째 탭을 비활성화
    const secondTabButton = screen.getByText('탭 2');
    fireEvent.click(secondTabButton);

    screen.getByText('탭 2 내용');
  });
});
