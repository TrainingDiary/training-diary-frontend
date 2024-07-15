export const scheduleList = [
  {
    startDate: '2024-07-01',
    existReserved: true,
    details: [
      {
        scheduleId: 12,
        startTime: '17:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 1,
        traineeName: '김열심',
        status: 'OPEN',
      },
      {
        scheduleId: 13,
        startTime: '19:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        status: 'RESERVED',
      },
    ],
  },
  {
    startDate: '2024-07-02',
    existReserved: false,
    details: [
      {
        scheduleId: 14,
        startTime: '19:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        status: 'RESERVE_APPLIED',
      },
    ],
  },
];
