import React from 'react';
import { useParams } from 'react-router-dom';

import Tabs from '@components/Tabs/Tabs';

const TraineeHome: React.FC = () => {
  const { traineeId } = useParams<{ traineeId: string }>();

  const tabs = [
    { label: '대시보드', path: `/trainee/${traineeId}/dashboard` },
    { label: '운동 기록', path: `/trainee/${traineeId}/session` },
    { label: '식단 관리', path: `/trainee/${traineeId}/diet` },
  ];

  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
    </React.Fragment>
  );
};

export default TraineeHome;
