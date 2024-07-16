export type ScheduleStatus =
  | 'PAST'
  | 'EMPTY'
  | 'OPEN'
  | 'RESERVE_APPLIED'
  | 'RESERVED';

export interface ScheduleDetailType {
  scheduleId: number;
  startTime: string;
  trainerId: number;
  trainerName: string;
  traineeId: number | null;
  traineeName: string | null;
  status: ScheduleStatus;
}

export interface ScheduleType {
  startDate: string;
  existReserved: boolean;
  details: ScheduleDetailType[];
}

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
        status: 'RESERVED',
      },
      {
        scheduleId: 16,
        startTime: '11:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        status: 'RESERVED',
      },
      {
        scheduleId: 17,
        startTime: '15:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: null,
        traineeName: null,
        status: 'OPEN',
      },
      {
        scheduleId: 18,
        startTime: '18:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        status: 'RESERVE_APPLIED',
      },
      {
        scheduleId: 19,
        startTime: '23:00',
        trainerId: 1,
        trainerName: '이근육',
        traineeId: 2,
        traineeName: '미나리',
        status: 'RESERVED',
      },
    ],
  },
];
