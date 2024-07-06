import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import AuthError from './AuthError';
import theme from '../../../styles/theme';

describe('AuthError가 렌더링 될 떄', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

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

  test('close button을 클릭하면 onClose 핸들러를 호출한다.', () => {
    renderWithTheme(
      <AuthError text="이메일을 입력해주세요." onClose={mockOnClose} />
    );

    const closeButton = screen.getByAltText('close button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
