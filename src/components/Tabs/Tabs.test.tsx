import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Tabs from './Tabs';
import theme from '../../styles/theme';

// Mock data for tabs
const tabs = [
  { label: '탭 1', path: '/tab1' },
  { label: '탭 2', path: '/tab2' },
  { label: '탭 3', path: '/tab3' },
];

// Tabs 컴포넌트를 ThemeProvider와 MemoryRouter로 감싸서 렌더링하는 함수
const renderWithProviders = (
  component: React.ReactElement,
  initialEntries: string[] = ['/tab1']
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={component}>
            {tabs.map(tab => (
              <Route
                key={tab.path}
                path={tab.path}
                element={<div>{`${tab.label} 내용`}</div>}
              />
            ))}
          </Route>
        </Routes>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Tabs 컴포넌트 테스트', () => {
  test('초기 렌더링 시 첫 번째 탭이 활성화 상태여야 한다.', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    expect(screen.getByText('탭 1')).toHaveStyle(
      `color: ${theme.colors.gray900}`
    );
    expect(screen.getByText('탭 1 내용')).toBeInTheDocument();
  });

  test('각 탭 클릭 시 해당 탭의 내용이 보여야 한다.', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    tabs.forEach(tab => {
      const tabButton = screen.getByText(tab.label);
      fireEvent.click(tabButton);

      expect(screen.getByText(`${tab.label} 내용`)).toBeInTheDocument();
    });
  });

  test('탭 클릭 시 활성화 스타일이 올바르게 적용되어야 한다.', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    tabs.forEach(tab => {
      const tabButton = screen.getByText(tab.label);
      fireEvent.click(tabButton);

      expect(tabButton).toHaveStyle(`color: ${theme.colors.gray900}`);
    });
  });

  test('탭 클릭 시 비활성화 스타일이 올바르게 적용되어야 한다.', () => {
    renderWithProviders(<Tabs tabs={tabs} />);

    // 첫 번째 탭을 클릭하여 활성화
    const firstTabButton = screen.getByText('탭 1');
    fireEvent.click(firstTabButton);
    expect(firstTabButton).toHaveStyle(`color: ${theme.colors.gray900}`);

    // 두 번째 탭을 클릭하여 첫 번째 탭을 비활성화
    const secondTabButton = screen.getByText('탭 2');
    fireEvent.click(secondTabButton);

    expect(secondTabButton).toHaveStyle(`color: ${theme.colors.gray900}`);
    expect(firstTabButton).toHaveStyle(`color: ${theme.colors.gray700}`);
  });
});
