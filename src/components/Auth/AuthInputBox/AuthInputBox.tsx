import React from 'react';
import styled from 'styled-components';

import hidePasswordIcon from '@icons/auth/hidePassword.svg';
import showPasswordIcon from '@icons/auth/showPassword.svg';
import Button from '@components/Common/Button/Button';

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

const InputContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const InputWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  padding: 9px 17px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.gray100};
`;

const Icon = styled.img`
  margin-right: 7px;
`;

const Input = styled.input<{ disabled?: boolean }>`
  flex-grow: 1;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray300 : theme.colors.gray100};
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
    -webkit-box-shadow: 0 0 0px 1000px
      ${({ theme, disabled }) =>
        disabled ? theme.colors.gray300 : theme.colors.gray100}
      inset;
  }

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }
`;

const ShowPasswordIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ErrorMessage = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.red400};
  line-height: 2;
`;

const ResendVerificationCode = styled.span`
  display: inline-block;
  align-self: flex-start;
  flex-shrink: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray700};
  line-height: 2;
  cursor: pointer;
`;

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  iconSrc: string;
  placeholder: string;
  type: string;
  id?: string;
  showPassword?: boolean;
  onToggleShowPassword?: () => void;
  showIcon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  error?: string;
}

const AuthInputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      label,
      iconSrc,
      placeholder,
      type,
      id,
      showPassword,
      onToggleShowPassword,
      showIcon,
      disabled,
      onClick,
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <Wrapper>
        <Label htmlFor={id ? id : type}>{label}</Label>
        <InputContainer>
          <InputWrapper disabled={disabled}>
            <Icon src={iconSrc} alt={`${label} icon`} />
            <Input
              ref={ref}
              name={id ? id : type}
              id={id ? id : type}
              type={type === 'password' && showPassword ? 'text' : type}
              placeholder={placeholder}
              disabled={disabled}
              {...rest}
            />
            {type === 'password' && showIcon && (
              <ShowPasswordIcon onClick={onToggleShowPassword}>
                <img
                  src={showPassword ? showPasswordIcon : hidePasswordIcon}
                  alt={
                    showPassword
                      ? '비밀번호 보기 아이콘'
                      : '비밀번호 숨기기 아이콘'
                  }
                />
              </ShowPasswordIcon>
            )}
          </InputWrapper>
          {id === 'code' && !disabled && (
            <Button $size="small" type="button" onClick={onClick}>
              인증
            </Button>
          )}
        </InputContainer>
        <ErrorMessage>{error}</ErrorMessage>
        {id === 'code' && !disabled && (
          <ResendVerificationCode>인증 번호 다시 보내기</ResendVerificationCode>
        )}
      </Wrapper>
    );
  }
);

export default AuthInputBox;
