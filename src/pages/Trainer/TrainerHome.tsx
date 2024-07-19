import React from 'react';

import Tabs from '@components/Tabs/Tabs';

const TrainerHome: React.FC = () => {
  const tabs = [
    { label: '트레이니 관리', path: '/trainer/trainees' },
    { label: '운동 종류 관리', path: '/trainer/workouts' },
  ];

  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
    </React.Fragment>
  );
};

export default TrainerHome;
