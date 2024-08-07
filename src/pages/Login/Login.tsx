import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import emailIcon from '@icons/auth/email.svg';
import passwordIcon from '@icons/auth/password.svg';
import Button from '@components/Common/Button/Button';
import Alert from '@components/Common/Alert/Alert';
import AuthSwitcher from '@components/Auth/AuthSwitcher';
import AuthTitle from '@components/Auth/AuthTitle';
import SocialLoginBox from '@components/Auth/SocialLoginBox';
import AuthInputBox from '@components/Auth/AuthInputBox/AuthInputBox';
import { AuthWrapper } from '@components/Auth/styledComponents/AuthWrapper';
import { AuthContainer } from '@components/Auth/styledComponents/AuthContainer';
import { AuthForm } from '@components/Auth/styledComponents/AuthForm';
import requestPermission from '../../firebase/notificationPermission';
import CreateAuthApi from 'src/api/auth';
import useUserStore from 'src/stores/userStore';

interface FormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authApi = CreateAuthApi(navigate);
  const { setUser } = useUserStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<string>('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const onToggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorAlert('');

    const { email, password } = formState;

    if (isLoading) return;
    if (!email) {
      setErrorAlert('이메일을 입력해주세요.');
      return;
    }
    if (!password) {
      setErrorAlert('비밀번호을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const response = await authApi.login(email, password);
      const user = {
        id: response.data.id,
        role: response.data.role,
        unreadNotification: response.data.unreadNotification,
      };

      setUser(user);

      await requestPermission(navigate);
    } catch (error) {
      setErrorAlert('이메일과 비밀번호를 확인해주세요.');
      console.error('로그인 에러: ', error);
    } finally {
      setLoading(false);
    }
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthTitle title="로그인" subtitle="Welcome back" />

        <AuthForm onSubmit={onSubmit}>
          <AuthInputBox
            label="이메일"
            iconSrc={emailIcon}
            placeholder="이메일을 입력해주세요."
            type="email"
            value={formState.email}
            onChange={onChange}
          />

          <AuthInputBox
            label="비밀번호"
            iconSrc={passwordIcon}
            placeholder="비밀번호를 입력해주세요."
            showPassword={showPassword}
            type="password"
            value={formState.password}
            onChange={onChange}
            onToggleShowPassword={onToggleShowPassword}
            showIcon={true}
          />

          <Button $size="large" $variant="primary" type="submit">
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </AuthForm>

        <SocialLoginBox />
      </AuthContainer>

      <AuthSwitcher>
        Don't have an account? <Link to={'/signup'}>Sign up</Link>
      </AuthSwitcher>

      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </AuthWrapper>
  );
};

export default Login;
