import React from 'react';

interface WeeklyContentProps {
  date?: Date | null;
}

const WeeklyContent: React.FC<WeeklyContentProps> = ({ date }) => {
  return <div>주별 콘텐츠</div>;
};

export default WeeklyContent;
