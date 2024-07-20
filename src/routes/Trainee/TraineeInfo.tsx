import React from 'react';

import Tabs from '@components/Tabs/Tabs';
import Dashboard from './Dashboard';
import Diet from './Diet';
import Session from './Session';

const TraineeInfo: React.FC = () => {
  const tabs = [
    {
      label: '대시보드',
      content: <Dashboard />,
    },
    {
      label: '운동 기록',
      content: <Session />,
    },
    {
      label: '식단 관리',
      content: <Diet />,
    },
  ];
  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
    </React.Fragment>
  );
};

export default TraineeInfo;
