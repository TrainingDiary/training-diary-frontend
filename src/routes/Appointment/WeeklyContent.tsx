import React from 'react';

interface WeeklyContentProps {
  date?: string | null;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({ date }) => {
  return <div>주별 콘텐츠: {date}</div>;
};

export default WeeklyContent;
