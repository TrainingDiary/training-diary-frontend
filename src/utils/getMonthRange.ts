import { startOfMonth, endOfMonth, format } from 'date-fns';

export const getMonthRange = (date: Date) => {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };
};
