import React from 'react';
import { hexToRgba } from 'src/utils/hexToRgba';
import styled from 'styled-components';

// ButtonWrapper 컴포넌트 스타일 정의
export const ButtonWrapper = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  cursor: pointer;
  width: 100%;
  white-space: nowrap;

  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.white : theme.colors.gray600};
  max-width: ${({ $size, theme }) => theme.size[$size]};
  background-color: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.main500 : theme.colors.gray100};
  border: ${({ $variant, theme }) =>
    $variant === 'primary' ? 'none' : `${theme.colors.gray300} solid 1px`};
  ${({ $variant, theme }) =>
    $variant !== 'primary' &&
    `box-shadow: 0 2px 2px ${hexToRgba(theme.colors.gray900, 0.06)};`}

  &:active {
    background-color: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.main700 : theme.colors.gray400};
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    background-color: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.main300 : theme.colors.gray300};
    color: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.white : theme.colors.gray500};
    cursor: not-allowed;
  }

  @media ${({ theme }) => theme.media.mobile} {
    width: 100%;
    max-width: 100%;
  }
`;

// ButtonProps
interface ButtonProps {
  children: string | void;
  $size: 'small' | 'medium' | 'large';
  $variant?: 'primary';
  onClick?: () => void;
  type?: 'submit' | 'button';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  $size,
  $variant,
  onClick,
  type,
  disabled,
}) => {
  return (
    <ButtonWrapper
      $size={$size}
      $variant={$variant}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;
