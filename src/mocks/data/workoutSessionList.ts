// 타입 정의
export interface Workout {
  workoutId: number;
  workoutTypeName: string;
  targetMuscle: string;
  remarks: string;
  weight: number;
  rep: number;
  sets: number;
  time: number;
  speed: number;
}

export interface SessionDetailType {
  sessionId: number;
  sessionDate: string;
  sessionNumber: number;
  specialNote: string;
  workouts: Workout[];
  photoUrls: string[];
  videoUrls: string[];
}

// 샘플 데이터
export const sessionDetails: SessionDetailType[] = [
  {
    sessionId: 1,
    sessionDate: '2024-07-23',
    sessionNumber: 1,
    specialNote: '첫 번째 세션 특이사항',
    workouts: [
      {
        workoutId: 1,
        workoutTypeName: '벤치 프레스',
        targetMuscle: '가슴',
        remarks: '가벼운 무게로 시작',
        weight: 50,
        rep: 10,
        sets: 3,
        time: 0,
        speed: 0,
      },
      {
        workoutId: 2,
        workoutTypeName: '스쿼트',
        targetMuscle: '다리',
        remarks: '폼 체크 필요',
        weight: 60,
        rep: 12,
        sets: 4,
        time: 0,
        speed: 0,
      },
    ],
    photoUrls: ['https://example.com/photo1.jpg'],
    videoUrls: ['https://example.com/video1.mp4'],
  },
  {
    sessionId: 2,
    sessionDate: '2024-07-24',
    sessionNumber: 2,
    specialNote: '두 번째 세션 특이사항',
    workouts: [
      {
        workoutId: 2,
        workoutTypeName: '스쿼트',
        targetMuscle: '다리',
        remarks: '폼 체크 필요',
        weight: 60,
        rep: 12,
        sets: 4,
        time: 0,
        speed: 0,
      },
    ],
    photoUrls: ['https://example.com/photo2.jpg'],
    videoUrls: ['https://example.com/video2.mp4'],
  },
  {
    sessionId: 3,
    sessionDate: '2024-07-25',
    sessionNumber: 3,
    specialNote: '세 번째 세션 특이사항',
    workouts: [
      {
        workoutId: 3,
        workoutTypeName: '데드리프트',
        targetMuscle: '등',
        remarks: '허리 조심',
        weight: 70,
        rep: 8,
        sets: 3,
        time: 0,
        speed: 0,
      },
    ],
    photoUrls: ['https://example.com/photo3.jpg'],
    videoUrls: ['https://example.com/video3.mp4'],
  },
];
