import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Tabs from '@components/Tabs/Tabs';
import TraineeManagement from './Trainer/TraineeManagement';
import WorkOutManagement from './Trainer/WorkOutManagement';

const Home: React.FC = () => {
  const [role, setRole] = useState<'TRAINEE' | 'TRAINER' | null>(null);
  const navigate = useNavigate();

  // 가정: role을 로그인 시 가져오는 함수
  useEffect(() => {
    // 실제로는 로그인 후 role을 받아오는 로직이 필요합니다.
    const fetchUserRole = async () => {
      // 예시: 로그인 후 받아온 role
      const userRole = 'TRAINER'; // 'TRAINEE'로 바꾸어 테스트 가능
      setRole(userRole as 'TRAINEE' | 'TRAINER');

      // 추가: TRAINEE 역할로 로그인 시 리다이렉트
      if (userRole !== 'TRAINER') {
        const userId = '1'; // 여기에 실제 사용자 ID를 설정해야 합니다.
        navigate(`/trainee/${userId}`);
      }
    };

    fetchUserRole();
  }, [navigate]);

  const trainerTabs = [
    {
      label: '트레이니 관리',
      content: <TraineeManagement />,
    },
    {
      label: '운동 종류 관리',
      content: <WorkOutManagement />,
    },
  ];

  if (role === null) {
    // 로딩 상태를 보여줄 수도 있습니다.
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Tabs tabs={trainerTabs} />
    </div>
  );
};

export default Home;
