import { useState } from 'react';

import Tabs from '@components/Tabs/Tabs';
import MonthlyContent from './MonthlyContent';
import WeeklyContent from './WeeklyContent';

const Appointment: React.FC = () => {
  const [selectedWeeklyDate, setSelectedWeeklyDate] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState(0);

  const onDateSelect = (date: string) => {
    setSelectedWeeklyDate(date);
    setActiveTab(1);
  };

  const tabs = [
    {
      label: '월별',
      content: <MonthlyContent onDateSelect={onDateSelect} />,
    },
    {
      label: '주별',
      content: <WeeklyContent date={selectedWeeklyDate} />,
    },
  ];

  return (
    <div>
      <Tabs
        tabs={tabs}
        currentIndex={activeTab}
        onTabChange={(index: number) => setActiveTab(index)}
      />
    </div>
  );
};

export default Appointment;
