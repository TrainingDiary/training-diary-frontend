import React from 'react';
import styled from 'styled-components';

// ButtonWrapper 컴포넌트 스타일 정의
const ButtonWrapper = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;

  color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.white : theme.colors.gray600};
  max-width: ${({ size, theme }) => theme.size[size]};
  background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.main500 : theme.colors.gray100};
  border: ${({ variant, theme }) =>
    variant === 'primary' ? 'none' : `${theme.colors.gray300} solid 1px`};

  &:active {
    background-color: ${({ variant, theme }) =>
      variant === 'primary' ? theme.colors.main700 : theme.colors.gray400};
    color: ${(props) => props.theme.colors.white};
  }
`;

// ButtonProps
interface ButtonProps {
  children: string;
  size: 'small' | 'medium' | 'large';
  variant?: 'primary';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, size, variant, onClick }) => {
  return (
    <ButtonWrapper size={size} variant={variant} onClick={onClick}>
      {children}
    </ButtonWrapper>
  );
};

export default Button;
