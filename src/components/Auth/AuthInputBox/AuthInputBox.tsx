import React from 'react';
import styled from 'styled-components';

import hidePasswordIcon from '@icons/hidePassword.svg';
import showPasswordIcon from '@icons/showPassword.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 1.6rem;
  font-family: 'NanumSquareBold';
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 17px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.gray100};
`;

const Icon = styled.img`
  margin-right: 7px;
`;

const Input = styled.input`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 1.6rem;
  border: none;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: ${({ theme }) => theme.colors.gray900};
    -webkit-box-shadow: 0 0 0px 1000px ${({ theme }) => theme.colors.gray100}
      inset;
  }
`;

const ShowPasswordIcon = styled.img`
  cursor: pointer;
`;

interface InputBoxProps {
  label: string;
  iconSrc: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
  showIcon?: boolean;
}

const AuthInputBox: React.FC<InputBoxProps> = ({
  label,
  iconSrc,
  placeholder,
  type,
  value,
  onChange,
  showPassword,
  onToggleShowPassword,
  showIcon,
}) => {
  return (
    <Wrapper>
      <Label htmlFor={type}>{label}</Label>
      <InputWrapper>
        <Icon src={iconSrc} alt={`${label} icon`} />
        <Input
          name={type}
          id={type}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === 'password' && showIcon && (
          <ShowPasswordIcon
            src={showPassword ? showPasswordIcon : hidePasswordIcon}
            onClick={onToggleShowPassword}
            alt={
              showPassword ? '비밀번호 보기 아이콘' : '비밀번호 숨기기 아이콘'
            }
          />
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default AuthInputBox;
