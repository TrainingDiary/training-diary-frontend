import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import theme from '../../../styles/theme';
import AuthInputBox from './AuthInputBox';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AuthInputBox가 렌더링 될 때', () => {
  const mockOnChange = jest.fn();
  const mockOnToggleShowPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('label과 placeholder, icon을 함께 보여준다.', () => {
    renderWithTheme(
      <AuthInputBox
        label="이메일"
        iconSrc="test-icon.svg"
        placeholder="Enter email"
        type="email"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByAltText('이메일 icon')).toBeInTheDocument();
  });

  test('입력값이 변경되면 onChange 핸들러를 호출한다.', () => {
    renderWithTheme(
      <AuthInputBox
        label="이메일"
        iconSrc="test-icon.svg"
        placeholder="Enter email"
        type="email"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText('Enter email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  describe('비밀번호 Input일 경우', () => {
    test('비밀번호 보기/숨기기 아이콘을 클릭하면 onToggleShowPassword 핸들러를 호출한다.', () => {
      renderWithTheme(
        <AuthInputBox
          label="비밀번호"
          iconSrc="test-icon.svg"
          placeholder="Enter password"
          type="password"
          value=""
          onChange={mockOnChange}
          showPassword={false}
          onToggleShowPassword={mockOnToggleShowPassword}
        />
      );

      const toggleIcon = screen.getByAltText('비밀번호 숨기기 아이콘');
      fireEvent.click(toggleIcon);

      expect(mockOnToggleShowPassword).toHaveBeenCalledTimes(1);
    });

    test('showPassword가 true일 경우 비밀번호 보기 아이콘을 보여준다.', () => {
      renderWithTheme(
        <AuthInputBox
          label="비밀번호"
          iconSrc="test-icon.svg"
          placeholder="Enter password"
          type="password"
          value=""
          onChange={mockOnChange}
          showPassword={true}
          onToggleShowPassword={mockOnToggleShowPassword}
        />
      );

      expect(screen.getByAltText('비밀번호 보기 아이콘')).toBeInTheDocument();
    });

    test('showPassword가 true일 경우 type이 text가 된다.', () => {
      renderWithTheme(
        <AuthInputBox
          label="비밀번호"
          iconSrc="test-icon.svg"
          placeholder="Enter password"
          type="password"
          value=""
          onChange={mockOnChange}
          showPassword={true}
          onToggleShowPassword={mockOnToggleShowPassword}
        />
      );

      const input = screen.getByPlaceholderText('Enter password');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
});
