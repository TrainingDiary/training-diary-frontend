// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

import { traineeList } from './data/traineeList';
import { workoutList } from './data/workoutList';

export const handlers = [
  http.get('/api/pt-contracts', () => {
    return HttpResponse.json(traineeList);
  }),

  http.get('/api/workout-types', () => {
    return HttpResponse.json(workoutList);
  }),
];
