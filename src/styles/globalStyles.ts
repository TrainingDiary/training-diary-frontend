import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
${reset};

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent; /* Safari and older versions of Chrome */
  -webkit-touch-callout: none; /* Prevent callout to copy image, etc when tap to hold */
}



//font-size base = 10px = 1rem / ex) 16px === 1.6rem
html, body{
  font-size: 10px;
  line-height: 1.5;
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  height: 100dvh;
  background-color: ${({ theme }) => theme.colors.gray200};
}

button{
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
}

input{
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  /* Hide number input spinner */
  -moz-appearance: textfield;
  appearance: textfield;

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

h1 {
  font-family: 'NanumSquareExtraBold'
}

#root{
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.white};
  height: 100%;
  position: relative;
  overflow-x: hidden;
}

// 브라우저 기본 스크롤 스타일 제거
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.react-datepicker__day--keyboard-selected, .react-datepicker__month-text--keyboard-selected, .react-datepicker__quarter-text--keyboard-selected, .react-datepicker__year-text--keyboard-selected{
  background-color: transparent;
}

.react-datepicker__day--keyboard-selected:hover, .react-datepicker__month-text--keyboard-selected:hover, .react-datepicker__quarter-text--keyboard-selected:hover, .react-datepicker__year-text--keyboard-selected:hover{
  background-color: #f0f0f0;
}

// view width 450px 이상이 되면 max-width = 450px로 고정 / 그 이하는 추후 작업하며 조절 예정
@media ${({ theme }) => theme.media.desktop} {
    #root {
      max-width: 450px;
    }
  }
`;

export default GlobalStyles;
