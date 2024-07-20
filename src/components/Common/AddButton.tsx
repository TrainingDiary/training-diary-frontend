import styled from 'styled-components';

import { hexToRgba } from 'src/utils/hexToRgba';

export const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.main400};
  padding: 15px 17px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: 0.1s;
  opacity: 0.8;
  line-height: 1;

  position: sticky;
  bottom: 80px;
  right: 30px;
  margin-left: auto;
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.black, 0.35)};
  display: block;
  z-index: 99;

  @media (max-width: 450px) {
    position: fixed;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.main600};
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`;
