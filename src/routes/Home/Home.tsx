import React from 'react';

import Tabs from '@components/Tabs/Tabs';

const Home: React.FC = () => {
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
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Home;
