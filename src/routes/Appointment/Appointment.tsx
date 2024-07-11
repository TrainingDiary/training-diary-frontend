import Tabs from '@components/Tabs/Tabs';
import MonthlyContent from './MonthlyContent';
import WeeklyContent from './WeeklyContent';

const Appointment: React.FC = () => {
  const tabs = [
    {
      label: '월별',
      content: <MonthlyContent />,
    },
    {
      label: '주별',
      content: <WeeklyContent />,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Appointment;
