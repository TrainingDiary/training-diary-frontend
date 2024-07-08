import styled from 'styled-components';

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  & > *:last-child {
    margin-top: 20px;
  }
`;
