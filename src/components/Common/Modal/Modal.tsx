import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Button from '../Button/Button';
import closeIcon from '@icons/modal/closeBtn.svg';
import { hexToRgba } from 'src/utils/hexToRgba';

// 스타일 정의
const ModalWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${(props) => hexToRgba(props.theme.colors.black, 0.5)};
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${(props) => props.theme.colors.white};
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
  border: solid 1px ${(props) => props.theme.colors.gray400};
  outline: none;
  color: ${(props) => props.theme.colors.gray900};
  &::placeholder {
    color: ${(props) => props.theme.colors.gray500};
  }
`;

const ErrorMessage = styled.span`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.red300};
  line-height: 20px;
  //TODO : error시 메시지 표출
  visibility: hidden;
`;

const ModalConfirmContent = styled.p`
  color: ${(props) => props.theme.colors.red400};
  font-size: 1.4rem;
  margin: 10px 0;
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
  children?: string;
  type: 'input' | 'confirm';
  isOpen: boolean;
  onClose: () => void;
  onSave?: (value?: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  type,
  children,
  isOpen,
  onClose,
  onSave,
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
    onClose();
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
              placeholder={children}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <ErrorMessage>ErrorMessage</ErrorMessage>
          </ModalInputWrapper>
        )}
        {type === 'confirm' && (
          <ModalConfirmContent>{children}</ModalConfirmContent>
        )}
        <ButtonGroup>
          <Button $size={'small'} onClick={onClose}>
            취소
          </Button>
          <Button $variant={'primary'} $size={'small'} onClick={handleSave}>
            저장
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;
