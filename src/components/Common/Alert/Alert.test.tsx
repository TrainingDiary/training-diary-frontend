import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import theme from '../../../styles/theme';
import Alert from './Alert';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Alert가 렌더링 될 때', () => {
  const mockOnClose = jest.fn();

  beforeAll(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('성공메세지와 성공아이콘을 보여준다.', () => {
    renderWithTheme(
      <Alert $type="success" text="Success message" onClose={mockOnClose} />
    );

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByAltText('success icon')).toBeInTheDocument();
  });

  test('에러메세지와 에러아이콘을 보여준다.', () => {
    renderWithTheme(
      <Alert $type="error" text="Error message" onClose={mockOnClose} />
    );

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByAltText('error icon')).toBeInTheDocument();
  });

  it('2.5초 후에 onClose 핸들러를 호출한다.', () => {
    renderWithTheme(
      <Alert $type="error" text="Error message" onClose={mockOnClose} />
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockOnClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('fade-in과 fade-out 애니메이션이 적용된다.', () => {
    renderWithTheme(
      <Alert $type="error" text="Error message" onClose={mockOnClose} />
    );

    const alert = screen.getByText('Error message').parentElement;
    expect(alert).toHaveStyle('opacity: 1');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(alert).toHaveStyle('opacity: 0');
  });
});
