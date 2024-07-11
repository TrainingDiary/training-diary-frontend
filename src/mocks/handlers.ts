// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

import trainee from './dummy.json';

export const handlers = [
  // 정적 파일 요청을 처리하는 핸들러 추가
  http.get('/src/assets/icons/:file', () => {
    return;
  }),
  http.get('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquare/:file', () => {
    return;
  }),

  http.get('/api/pt-contract', () => {
    return HttpResponse.json(trainee);
  }),
];
