// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

import { traineeList } from './data/traineeList';
import { workoutList } from './data/workoutList';

export const handlers = [
  // 정적 파일 요청을 처리하는 핸들러 추가
  http.get('/src/assets/icons/:folder/:file', () => {
    return;
  }),
  http.get(
    'https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquare/:file',
    () => {
      return;
    }
  ),

  http.get('/api/pt-contracts', () => {
    return HttpResponse.json(traineeList);
  }),

  http.get('/api/workout-types', () => {
    return HttpResponse.json(workoutList);
  }),
];
