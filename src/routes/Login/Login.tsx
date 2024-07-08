import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
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

interface FormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const { email, password } = formState;

    if (isLoading) return;
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      setError('비밀번호을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // 로그인 API 요청 단계 추가

      navigate('/');
    } catch (error) {
      setError('이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const onCloseError = () => setError('');

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthTitle title="로그인" subtitle="Welcome back" />

        <AuthForm onSubmit={onSubmit}>
          <AuthInputBox
            label="이메일"
            iconSrc={emailIcon}
            placeholder="Enter email"
            type="email"
            value={formState.email}
            onChange={onChange}
          />

          <AuthInputBox
            label="비밀번호"
            iconSrc={passwordIcon}
            placeholder="Enter password"
            showPassword={showPassword}
            type={'password'}
            value={formState.password}
            onChange={onChange}
            onToggleShowPassword={onToggleShowPassword}
          />

          <Button $size="large" $variant="primary" type="submit">
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </AuthForm>

        <SocialLoginBox />
      </AuthContainer>

      <AuthSwitcher>
        Don't have an account? <Link to={'/'}>Sign up</Link>
      </AuthSwitcher>

      {error && <Alert $type="error" text={error} onClose={onCloseError} />}
    </AuthWrapper>
  );
};

export default Login;
