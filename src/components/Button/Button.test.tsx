import { render, screen, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

import Button from '../../components/Button/Button';
import theme from '../../styles/theme';

describe('Button Component', () => {
  test('renders correctly with primary variant', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button size="large" variant="primary">
          로그인
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByText('로그인');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyleRule('background-color', theme.colors.main500);
    expect(button).toHaveStyleRule('color', theme.colors.white);
  });

  test('renders correctly with secondary variant', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button size="large">회원 가입</Button>
      </ThemeProvider>
    );

    const button = screen.getByText('회원 가입');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyleRule('background-color', theme.colors.gray100);
    expect(button).toHaveStyleRule('color', theme.colors.gray600);
  });

  test('renders correctly with different sizes', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button size="small" variant="primary">
          중복확인
        </Button>
        <Button size="medium">중간 버튼</Button>
        <Button size="large" variant="primary">
          이메일 인증
        </Button>
      </ThemeProvider>
    );

    const smallButton = screen.getByText('중복확인');
    const mediumButton = screen.getByText('중간 버튼');
    const largeButton = screen.getByText('이메일 인증');

    expect(smallButton).toHaveStyleRule('max-width', theme.size.small);
    expect(mediumButton).toHaveStyleRule('max-width', theme.size.medium);
    expect(largeButton).toHaveStyleRule('max-width', theme.size.large);
  });

  test('applies active styles correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button size="large" variant="primary">
          활성화 상태
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByText('활성화 상태');
    expect(button).toHaveStyleRule('background-color', theme.colors.main700, {
      modifier: ':active',
    });
    expect(button).toHaveStyleRule('color', theme.colors.white, {
      modifier: ':active',
    });
  });

  test('handles click events correctly', () => {
    const handleClick = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Button size="large" variant="primary" onClick={handleClick}>
          클릭 테스트
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByText('클릭 테스트');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
