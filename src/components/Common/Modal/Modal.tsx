import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Button from '../Button/Button';
import closeIcon from '@icons/modal/closeBtn.svg';
import { hexToRgba } from 'src/utils/hexToRgba';

// 스타일 정의
const ModalWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => hexToRgba(theme.colors.black, 0.5)};
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  max-width: 450px;
  transform: translateX(-50%);
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: calc(100% - 40px);
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-family: 'NanumSquareExtraBold';
`;

const ModalInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalInput = styled.input`
  padding: 10px 16px;
  border-radius: 5px;
  border: solid 1px ${({ theme }) => theme.colors.gray400};
  outline: none;
  color: ${({ theme }) => theme.colors.gray900};
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const ErrorMessage = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.red300};
  line-height: 20px;
  //TODO : error시 메시지 표출
  visibility: hidden;
`;

const ModalConfirmContent = styled.p`
  color: ${({ theme }) => theme.colors.red400};
  font-size: 1.4rem;
  margin: 10px 0;

  @media ${({ theme }) => theme.media.mobile} {
    font-size: 1.3rem;
  }
`;

const ModalCustomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.red300};
  text-align: right;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

// ModalProps 타입 정의
interface ModalProps {
  title: string;
  children?: React.ReactNode;
  type: 'input' | 'confirm' | 'custom';
  isOpen: boolean;
  onClose: () => void;
  onSave?: (value?: string) => void;
  btnConfirm?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  type,
  children,
  isOpen,
  onClose,
  onSave,
  btnConfirm,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (onSave) {
      onSave(inputValue);
    }
  };

  return (
    <ModalWrapper $isOpen={isOpen} role="dialog" aria-hidden={!isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="Close Icon" />
        </CloseButton>
        <Title>{title}</Title>
        {type === 'input' && (
          <ModalInputWrapper>
            <ModalInput
              type="text"
              value={inputValue}
              placeholder={typeof children === 'string' ? children : undefined}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <ErrorMessage>ErrorMessage</ErrorMessage>
          </ModalInputWrapper>
        )}
        {type === 'confirm' && (
          <ModalConfirmContent>{children}</ModalConfirmContent>
        )}
        {type === 'custom' && (
          <ModalCustomWrapper>{children}</ModalCustomWrapper>
        )}
        <ButtonGroup>
          <Button $size={'small'} onClick={onClose}>
            취소
          </Button>
          <Button $variant={'primary'} $size={'small'} onClick={handleSave}>
            {btnConfirm ? btnConfirm : '추가'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
