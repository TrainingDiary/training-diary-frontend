import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const HiddenRadio = styled.input`
  display: none;

  &:checked + label {
    color: ${({ theme }) => theme.colors.main800};
    font-family: 'NanumSquareBold';
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 1.6rem;
  cursor: pointer;
`;

interface RoleSelectorProps {
  role: 'trainee' | 'trainer';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onChange }) => {
  return (
    <Wrapper>
      <HiddenRadio
        type="radio"
        id="trainee"
        name="role"
        value="trainee"
        checked={role === 'trainee'}
        onChange={onChange}
      />

      <Label htmlFor="trainee">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C14.5264 4 16.7792 5.17107 18.2454 7C19.3433 8.3696 20 10.1081 20 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 12L11 15L16 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Trainee(트레이니)
      </Label>

      <HiddenRadio
        type="radio"
        id="trainer"
        name="role"
        value="trainer"
        checked={role === 'trainer'}
        onChange={onChange}
      />

      <Label htmlFor="trainer">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C14.5264 4 16.7792 5.17107 18.2454 7C19.3433 8.3696 20 10.1081 20 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 12L11 15L16 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Trainer(트레이너)
      </Label>
    </Wrapper>
  );
};

export default RoleSelector;