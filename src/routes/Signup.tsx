import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@components/Common/Button/Button';
import Alert from '@components/Common/Alert/Alert';
import AuthSwitcher from '@components/Auth/AuthSwitcher';
import AuthTitle from '@components/Auth/AuthTitle';
import SocialLoginBox from '@components/Auth/SocialLoginBox';
import AuthInputBox from '@components/Auth/AuthInputBox/AuthInputBox';
import { AuthWrapper } from '@components/Auth/styledComponents/AuthWrapper';
import { AuthContainer } from '@components/Auth/styledComponents/AuthContainer';
import { AuthForm } from '@components/Auth/styledComponents/AuthForm';
import emailIcon from '@icons/email.svg';
import passwordIcon from '@icons/password.svg';
import nameIcon from '@icons/name.svg';
import RoleSelector from '@components/Auth/RoleSelector';

interface FormState {
  email: string;
  code: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: 'trainee' | 'trainer';
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    code: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'trainee',
  });
  const [showEmailCodeInput, setShowEmailCodeInput] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<string>('');
  const [errorAlert, setErrorAlert] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      role: event.target.value as 'trainee' | 'trainer',
    }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorAlert('');

    if (isLoading) return;

    try {
      setLoading(true);

      // 회원가입 API 요청 단계 추가

      setSuccessAlert('회원가입에 성공했습니다.');

      setTimeout(() => navigate('/'), 2500);
    } catch (error) {
      setErrorAlert('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onEmailVerificationBtnClick = () => {
    // 이메일 중복 확인 및 인증메일 전송 API 요청 단계 추가
    setShowEmailCodeInput(true);
  };

  const onEmailVerify = () => {
    // 이메일 코드 확인 API 요청 단계 추가
    setIsCodeVerified(true);
    setSuccessAlert('이메일 인증에 성공했습니다.');
  };

  const onCloseSuccessAlert = () => setSuccessAlert('');
  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthTitle title="환영합니다." subtitle="Create an account" />

        <AuthForm onSubmit={onSubmit}>
          <RoleSelector role={formState.role} onChange={onRoleChange} />

          <AuthInputBox
            label="이메일"
            iconSrc={emailIcon}
            placeholder="이메일을 입력해주세요."
            type="email"
            value={formState.email}
            onChange={onChange}
            disabled={showEmailCodeInput}
          />

          {!showEmailCodeInput && (
            <Button
              $size="large"
              $variant="primary"
              onClick={onEmailVerificationBtnClick}
              type="button"
            >
              이메일 인증
            </Button>
          )}

          {showEmailCodeInput && (
            <AuthInputBox
              label="이메일 인증"
              iconSrc={emailIcon}
              placeholder="인증코드를 입력해주세요."
              type="text"
              value={formState.code}
              id="code"
              onChange={onChange}
              disabled={isCodeVerified}
              onClick={onEmailVerify}
            />
          )}

          <AuthInputBox
            label="이름"
            iconSrc={nameIcon}
            placeholder="이름을 입력해주세요."
            type="text"
            value={formState.name}
            id="name"
            onChange={onChange}
          />

          <AuthInputBox
            label="비밀번호"
            iconSrc={passwordIcon}
            placeholder="영어/숫자/특수문자 포함 8 ~ 15자"
            type="password"
            value={formState.password}
            onChange={onChange}
            showIcon={false}
          />

          <AuthInputBox
            label="비밀번호 확인"
            iconSrc={passwordIcon}
            placeholder="비밀번호를 입력해주세요."
            type="password"
            value={formState.confirmPassword}
            id="confirmPassword"
            onChange={onChange}
            showIcon={false}
          />

          <Button $size="large" $variant="primary" type="submit">
            {isLoading ? '회원가입 중...' : '회원가입'}
          </Button>
        </AuthForm>

        <SocialLoginBox />
      </AuthContainer>

      <AuthSwitcher>
        Already have an account? <Link to={'/login'}>Sign in</Link>
      </AuthSwitcher>

      {successAlert && (
        <Alert
          $type="success"
          text={successAlert}
          onClose={onCloseSuccessAlert}
        />
      )}
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </AuthWrapper>
  );
};

export default Signup;
