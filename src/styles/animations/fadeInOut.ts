import { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const fadeInStyles = css`
  opacity: 1;
  animation: ${fadeIn} ease-in-out 0.5s;
`;

export const fadeOutStyles = css`
  opacity: 0;
  animation: ${fadeOut} ease-in-out 0.5s;
`;
