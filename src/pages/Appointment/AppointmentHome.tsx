import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, isValid, parse } from 'date-fns';

import Tabs from '@components/Common/Tabs/Tabs';

const AppointmentHome: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const weeklyPath = date
    ? `/appointment/weekly/${date}`
    : `/appointment/weekly/${currentDate}`;

  const tabs = [
    { label: '월별', path: `/appointment/monthly` },
    { label: '주별', path: weeklyPath },
  ];

  useEffect(() => {
    if (date) {
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        navigate('/not-found', { replace: true });
      }
    }
  }, [date]);

  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
    </React.Fragment>
  );
};

export default AppointmentHome;
