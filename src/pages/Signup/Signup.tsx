import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Button from '@components/Common/Button/Button';
import Alert from '@components/Common/Alert/Alert';
import AuthSwitcher from '@components/Auth/AuthSwitcher';
import AuthTitle from '@components/Auth/AuthTitle';
import SocialLoginBox from '@components/Auth/SocialLoginBox';
import AuthInputBox from '@components/Auth/AuthInputBox/AuthInputBox';
import { AuthWrapper } from '@components/Auth/styledComponents/AuthWrapper';
import { AuthContainer } from '@components/Auth/styledComponents/AuthContainer';
import { AuthForm } from '@components/Auth/styledComponents/AuthForm';
import RoleSelector from '@components/Auth/RoleSelector';
import { codePattern, emailPattern, passwordPattern } from 'src/utils/regExp';
import emailIcon from '@icons/auth/email.svg';
import passwordIcon from '@icons/auth/password.svg';
import nameIcon from '@icons/auth/name.svg';
import CreateAuthApi from 'src/api/auth';

interface FormState {
  email: string;
  code: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: 'TRAINEE' | 'TRAINER';
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const AuthApi = CreateAuthApi(navigate);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormState>({
    mode: 'onChange',
    defaultValues: {
      role: 'TRAINEE',
    },
  });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSendingEmail, setSendingEmail] = useState<boolean>(false);
  const [showEmailCodeInput, setShowEmailCodeInput] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<string>('');
  const [errorAlert, setErrorAlert] = useState<string>('');

  const email = watch('email');

  const onSubmit = async (data: FormState) => {
    setErrorAlert('');

    if (isLoading) return;

    try {
      setLoading(true);

      // 회원가입 API 요청 단계 추가
      console.log(data);

      setSuccessAlert('회원가입에 성공했습니다.');

      setTimeout(() => navigate('/'), 2500);
    } catch (error) {
      setErrorAlert('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const onEmailVerificationBtnClick = async () => {
    try {
      setSendingEmail(true);

      await AuthApi.checkEmail(email);

      setShowEmailCodeInput(true);

      setSuccessAlert('인증메일이 발송되었습니다.');
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setErrorAlert('이미 등록된 이메일입니다.');
      } else {
        console.error('이메일 인증 에러: ', error);
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const onEmailVerify = async () => {
    const verificationCode = watch('code');

    if (!verificationCode) {
      setErrorAlert('인증코드를 입력해주세요.');
      return;
    }

    if (errors.code?.message) {
      setErrorAlert(errors.code.message);
      return;
    }

    try {
      await AuthApi.checkCode(email, verificationCode);
      setIsCodeVerified(true);
      setSuccessAlert('이메일 인증에 성공했습니다.');
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorAlert('인증 코드가 일치하지 않습니다.');
      } else if (error.response && error.response.status === 406) {
        setErrorAlert('인증 코드가 만료되었습니다. 다시 시도해주세요.');
      } else {
        console.error('인증 코드 확인 에러: ', error);
      }
    }
  };

  const onCloseSuccessAlert = () => setSuccessAlert('');
  const onCloseErrorAlert = () => setErrorAlert('');

  const isEmailValid = email && !errors.email;

  const validatePasswordConfirm = (value: string) => {
    return value === watch('password') || '비밀번호가 일치하지 않습니다.';
  };

  return (
    <AuthWrapper>
      <AuthContainer>
        <AuthTitle title="환영합니다." subtitle="Create an account" />

        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <RoleSelector
            role={watch('role')}
            onChange={e =>
              setValue('role', e.target.value as 'TRAINEE' | 'TRAINER')
            }
          />

          <AuthInputBox
            label="이메일"
            iconSrc={emailIcon}
            placeholder="이메일을 입력해주세요."
            type="text"
            disabled={showEmailCodeInput}
            error={errors.email?.message}
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: emailPattern,
                message: '유효한 이메일을 입력해주세요.',
              },
            })}
          />

          {!showEmailCodeInput && (
            <Button
              $size="large"
              $variant="primary"
              onClick={onEmailVerificationBtnClick}
              type="button"
              disabled={!isEmailValid}
            >
              {isSendingEmail ? '인증메일 발송 중...' : '이메일 인증'}
            </Button>
          )}

          {showEmailCodeInput && (
            <AuthInputBox
              label="이메일 인증"
              iconSrc={emailIcon}
              placeholder="인증코드를 입력해주세요."
              type="number"
              id="code"
              disabled={isCodeVerified}
              onClick={onEmailVerify}
              onResendVerificationCode={onEmailVerificationBtnClick}
              {...register('code', {
                required: '인증코드를 입력해주세요.',
                pattern: {
                  value: codePattern,
                  message: '유효한 인증코드를 입력해주세요.',
                },
              })}
            />
          )}

          <AuthInputBox
            label="이름"
            iconSrc={nameIcon}
            placeholder="이름을 입력해주세요."
            type="text"
            id="name"
            error={errors.name?.message}
            {...register('name', {
              required: '이름을 입력해주세요.',
            })}
          />

          <AuthInputBox
            label="비밀번호"
            iconSrc={passwordIcon}
            placeholder="영어/숫자/특수문자 모두 포함 8 ~ 15자"
            type="password"
            maxLength={15}
            showIcon={false}
            error={errors.password?.message}
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              pattern: {
                value: passwordPattern,
                message:
                  '영어/숫자/특수문자 모두 포함 8 ~ 15자로 입력해주세요.',
              },
            })}
          />

          <AuthInputBox
            label="비밀번호 확인"
            iconSrc={passwordIcon}
            placeholder="비밀번호를 입력해주세요."
            type="password"
            id="confirmPassword"
            maxLength={15}
            showIcon={false}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: '비밀번호 확인란을 입력해주세요.',
              validate: validatePasswordConfirm,
            })}
          />

          <Button
            $size="large"
            $variant="primary"
            type="submit"
            disabled={!isCodeVerified || !isValid}
          >
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
