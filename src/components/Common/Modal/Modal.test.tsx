import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'src/styles/theme';
import Modal from './Modal';

// ThemeProvider로 감싼 컴포넌트를 렌더링하는 헬퍼 함수
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Modal 컴포넌트 테스트', () => {
  test('모달이 열렸을 때 렌더링 되어야 한다.', () => {
    renderWithTheme(
      <Modal title="테스트 모달" type="confirm" isOpen={true} onClose={() => {}}>
        정말로 이 작업을 수행하시겠습니까?
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('테스트 모달')).toBeInTheDocument();
    expect(screen.getByText('정말로 이 작업을 수행하시겠습니까?')).toBeInTheDocument();
  });

  test('모달이 닫혔을 때 렌더링 되지 않아야 한다.', () => {
    renderWithTheme(
      <Modal title="테스트 모달" type="confirm" isOpen={false} onClose={() => {}}>
        정말로 이 작업을 수행하시겠습니까?
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('입력 모달에서 입력값이 변경될 때 상태가 업데이트 되어야 한다.', () => {
    renderWithTheme(
      <Modal title="입력 모달" type="input" isOpen={true} onClose={() => {}}>
        입력할 내용을 적어주세요.
      </Modal>
    );

    const input = screen.getByPlaceholderText('입력할 내용을 적어주세요.');
    fireEvent.change(input, { target: { value: '새 입력값' } });

    expect(input).toHaveValue('새 입력값');
  });

  test('저장 버튼 클릭 시 onSave 함수가 호출되어야 한다.', () => {
    const handleSave = jest.fn();
    renderWithTheme(
      <Modal title="입력 모달" type="input" isOpen={true} onClose={() => {}} onSave={handleSave}>
        입력할 내용을 적어주세요.
      </Modal>
    );

    const input = screen.getByPlaceholderText('입력할 내용을 적어주세요.');
    fireEvent.change(input, { target: { value: '새 입력값' } });

    const saveButton = screen.getByText('저장');
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith('새 입력값');
  });

  test('취소 버튼 클릭 시 onClose 함수가 호출되어야 한다.', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal title="입력 모달" type="input" isOpen={true} onClose={handleClose}>
        입력할 내용을 적어주세요.
      </Modal>
    );

    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
