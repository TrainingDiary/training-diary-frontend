import React from 'react';

import Tabs from '@components/Tabs/Tabs';

const TraineeInfo: React.FC = () => {
  const tabs = [
    {
      label: '대시보드',
      content: <div>Tab 1 Content</div>,
    },
    {
      label: '운동 기록',
      content: <div>Tab 2 Content</div>,
    },
    {
      label: '식단 관리',
      content: <div>Tab 3 Content</div>,
    },
  ];
  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
    </React.Fragment>
  );
};

export default TraineeInfo;
