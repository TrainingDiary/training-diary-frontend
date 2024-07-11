import React from 'react';
import styled from 'styled-components';

import { ButtonWrapper } from '@components/Common/Button/Button';

interface BorderlessButtonWrapperProps {
  $isSelected: boolean;
  $selectedButton: string | null;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
`;

const BorderlessButtonWrapper = styled(
  ButtonWrapper
)<BorderlessButtonWrapperProps>`
  border: none;
  background-color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.main500 : theme.colors.gray100};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.gray600};

  &:active {
    background-color: ${({ $isSelected, $selectedButton, theme }) =>
      $isSelected
        ? theme.colors.main500
        : $selectedButton !== null
        ? theme.colors.gray300
        : theme.colors.gray100};
  }
`;

interface ButtonContainerProps {
  onButtonClick: (buttonType: string) => void;
  selectedButton: string | null;
}

const ButtonContainer: React.FC<ButtonContainerProps> = ({
  onButtonClick,
  selectedButton,
}) => {
  return (
    <Wrapper>
      <BorderlessButtonWrapper
        $size="large"
        onClick={() => onButtonClick('open')}
        $isSelected={selectedButton === 'open'}
        $selectedButton={selectedButton}
        disabled={selectedButton !== null && selectedButton !== 'open'}
      >
        수업일 일괄 오픈
      </BorderlessButtonWrapper>
      <BorderlessButtonWrapper
        $size="large"
        onClick={() => onButtonClick('register')}
        $isSelected={selectedButton === 'register'}
        $selectedButton={selectedButton}
        disabled={selectedButton !== null && selectedButton !== 'register'}
      >
        수업 일괄 등록
      </BorderlessButtonWrapper>
    </Wrapper>
  );
};

export default ButtonContainer;
