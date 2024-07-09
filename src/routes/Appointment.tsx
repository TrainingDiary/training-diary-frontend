import Tabs from '@components/Tabs/Tabs';

const Appointment: React.FC = () => {
  const tabs = [
    {
      label: '월별',
      content: <div>Tab 1 Content</div>,
    },
    {
      label: '주별',
      content: <div>Tab 2 Content</div>,
    },
  ];

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Appointment;
