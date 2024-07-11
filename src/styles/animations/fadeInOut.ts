import { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);

  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform:translateX(-50%) translateY(0);

  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);

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
