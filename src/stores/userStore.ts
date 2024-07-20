// api 연동 후 zustand 이용해 수정

interface User {
  id: string;
  role: string;
}

// 로그인 하지 않은 유저 상태 테스트하려면 주석해제
// export const user: User | null = null;

// 트레이너 유저 테스트하려면 주석해제
export const user: User | null = {
  id: '1',
  role: 'TRAINER',
};

// 트레이니 유저 테스트하려면 주석해제
// export const user: User | null = {
//   id: '1',
//   role: 'TRAINEE',
// };
