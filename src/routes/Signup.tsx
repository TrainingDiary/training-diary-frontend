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
import emailIcon from '@icons/email.svg';
import passwordIcon from '@icons/password.svg';
import nameIcon from '@icons/name.svg';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormState>({
    mode: 'onBlur',
    defaultValues: {
      role: 'TRAINEE',
    },
  });

  const [isLoading, setLoading] = useState<boolean>(false);
  const [showEmailCodeInput, setShowEmailCodeInput] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<string>('');
  const [errorAlert, setErrorAlert] = useState<string>('');

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

  const onEmailVerificationBtnClick = () => {
    // 이메일 중복 확인 및 인증메일 전송 API 요청 단계 추가
    setShowEmailCodeInput(true);
  };

  const onEmailVerify = () => {
    if (errors.code?.message) {
      setErrorAlert(errors.code.message);
      return;
    }

    // 이메일 코드 확인 API 요청 단계 추가
    setIsCodeVerified(true);
    setSuccessAlert('이메일 인증에 성공했습니다.');
  };

  const onCloseSuccessAlert = () => setSuccessAlert('');
  const onCloseErrorAlert = () => setErrorAlert('');

  const email = watch('email');
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
            onChange={(e) =>
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
              required: '이메일은 필수 항목입니다.',
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
              이메일 인증
            </Button>
          )}

          {showEmailCodeInput && (
            <AuthInputBox
              label="이메일 인증"
              iconSrc={emailIcon}
              placeholder="인증코드를 입력해주세요."
              type="text"
              id="code"
              disabled={isCodeVerified}
              onClick={onEmailVerify}
              {...register('code', {
                required: '인증코드는 필수 항목입니다.',
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
              required: '이름은 필수 항목입니다.',
            })}
          />

          <AuthInputBox
            label="비밀번호"
            iconSrc={passwordIcon}
            placeholder="영어/숫자/특수문자 모두 포함 8 ~ 15자"
            type="password"
            showIcon={false}
            error={errors.password?.message}
            {...register('password', {
              required: '비밀번호는 필수 항목입니다.',
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
            showIcon={false}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: '비밀번호 확인란은 필수 항목입니다.',
              validate: validatePasswordConfirm,
            })}
          />

          <Button
            $size="large"
            $variant="primary"
            type="submit"
            disabled={!isCodeVerified}
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
