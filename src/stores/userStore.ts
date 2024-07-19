// api 연동 후 zustand 이용해 수정

interface User {
  id: string;
  role: string;
}

// 로그인 하지 않은 유저 상태 테스트하려면 user에 null 할당
// 트레이니 유저 테스트하려면 role에 'TRAINEE' 할당
export const user: User | null = {
  id: '1',
  role: 'TRAINER',
};
