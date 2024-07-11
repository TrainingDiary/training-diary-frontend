// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

import people from './dummy.json';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(people);
  }),
  // 정적 파일 요청을 처리하는 핸들러 추가
  http.get('/src/assets/icons/:file', () => {
    return;
  }),
  http.get('https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquare/:file', () => {
    return;
  }),
];
