import { ScheduleType } from '@components/Appointment/ScheduleDetail';

export const scheduleList: ScheduleType[] = [
  {
    startDate: '2024-07-01',
    existReserved: true,
    details: [
      {
        scheduleId: 12,
        startTime: '17:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: null,
        traineeName: null,
        scheduleStatus: 'OPEN',
      },
      {
        scheduleId: 13,
        startTime: '19:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        scheduleStatus: 'RESERVED',
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
        scheduleStatus: 'RESERVE_APPLIED',
      },
    ],
  },
  {
    startDate: '2024-07-05',
    existReserved: true,
    details: [
      {
        scheduleId: 15,
        startTime: '09:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 1,
        traineeName: '김열심',
        scheduleStatus: 'RESERVED',
      },
      {
        scheduleId: 16,
        startTime: '11:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        scheduleStatus: 'RESERVED',
      },
      {
        scheduleId: 17,
        startTime: '15:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: null,
        traineeName: null,
        scheduleStatus: 'OPEN',
      },
      {
        scheduleId: 18,
        startTime: '18:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        scheduleStatus: 'RESERVE_APPLIED',
      },
      {
        scheduleId: 19,
        startTime: '23:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        scheduleStatus: 'RESERVED',
      },
    ],
  },
];
