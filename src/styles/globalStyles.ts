import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
${reset};

* {
  box-sizing: border-box;
}

//font-size base = 10px = 1rem / ex) 16px === 1.6rem 
html, body{
  font-size: 10px;
  line-height: 1.5;
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.gray200};
}

button{
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif ;
}

input{
  font-family: 'NanumSquare', 'Noto Sans KR', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif ;
}

h1 {
  font-family: 'NanumSquareExtraBold'
}

#root{
  margin: 0 auto;
  background-color: ${(props) => props.theme.colors.white};
  height: 100%;
  position: relative;
  overflow: hidden;
}

// 브라우저 기본 스크롤 스타일 제거
* {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
}

*::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

// view width 767px 이상이 되면 max-width = 450px로 고정 / 그 이하는 추후 작업하며 조절 예정
@media ${({ theme }) => theme.media.desktop} {
    #root {
      max-width: 450px;
    }
  }
`;

export default GlobalStyles;
