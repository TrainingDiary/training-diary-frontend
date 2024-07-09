import { render, screen, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';

import Button from '@components/Common/Button/Button';
import theme from '../../../styles/theme';

describe('버튼이 렌더링 될 때', () => {
  test('primary 형으로 올바르게 메인 컬러의 버튼을 보여준다.', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button $size="large" $variant="primary">
          로그인
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByText('로그인');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyleRule('background-color', theme.colors.main500);
    expect(button).toHaveStyleRule('color', theme.colors.white);
  });

  test('variant props가 없다면 회색 버튼을 보여준다.', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button $size="large">회원 가입</Button>
      </ThemeProvider>
    );

    const button = screen.getByText('회원 가입');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyleRule('background-color', theme.colors.gray100);
    expect(button).toHaveStyleRule('color', theme.colors.gray600);
  });

  test('size props에 따라 다른 크기의 버튼을 보여준다.', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button $size="small" $variant="primary">
          중복확인
        </Button>
        <Button $size="medium">중간 버튼</Button>
        <Button $size="large" $variant="primary">
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

  test('active 상태에 버튼의 올바른 스타일을 보여준다.', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button $size="large" $variant="primary">
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

  test('버튼의 클릭 이벤트가 올바르게 작동한다.', () => {
    const handleClick = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Button $size="large" $variant="primary" onClick={handleClick}>
          클릭 테스트
        </Button>
      </ThemeProvider>
    );

    const button = screen.getByText('클릭 테스트');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
