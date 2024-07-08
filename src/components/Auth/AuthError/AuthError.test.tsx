import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import theme from '../../../styles/theme';
import AuthError from './AuthError';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AuthError가 렌더링 될 때', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('에러메세지와 에러아이콘, 닫기버튼을 보여준다.', () => {
    renderWithTheme(
      <AuthError text="이메일을 입력해주세요." onClose={mockOnClose} />
    );

    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();

    const errorIcon = screen.getByAltText('error icon');
    expect(errorIcon).toBeInTheDocument();

    const closeButton = screen.getByAltText('close button');
    expect(closeButton).toBeInTheDocument();
  });

  test('fade-in style이 적용된다.', () => {
    renderWithTheme(
      <AuthError text="이메일을 입력해주세요." onClose={mockOnClose} />
    );
    const wrapper = screen.getByText('이메일을 입력해주세요.').parentElement;
    expect(wrapper).toHaveStyle('opacity: 1');
  });

  test('close button을 클릭하면 onClose 핸들러를 호출한다.', async () => {
    renderWithTheme(
      <AuthError text="이메일을 입력해주세요." onClose={mockOnClose} />
    );

    const closeButton = screen.getByAltText('close button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('close button을 클릭하면 fade-out style이 적용된다.', () => {
    renderWithTheme(
      <AuthError text="이메일을 입력해주세요." onClose={mockOnClose} />
    );

    const closeButton = screen.getByAltText('close button');
    fireEvent.click(closeButton);
    const wrapper = screen.getByText('이메일을 입력해주세요.').parentElement;
    expect(wrapper).toHaveStyle('opacity: 0');
  });
});
