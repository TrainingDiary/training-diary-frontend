import { addDays, endOfMonth, format, startOfMonth, subDays } from 'date-fns';
import { create } from 'zustand';

interface CalendarState {
  selectedDate: Date;
  startDate: string;
  endDate: string;
  setSelectedDate: (date: Date) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}

const today = new Date();
const initialStartDate = format(subDays(startOfMonth(today), 10), 'yyyy-MM-dd');
const initialEndDate = format(addDays(endOfMonth(today), 10), 'yyyy-MM-dd');

const useCalendarStore = create<CalendarState>(set => ({
  selectedDate: today,
  startDate: initialStartDate,
  endDate: initialEndDate,
  setSelectedDate: selectedDate => set({ selectedDate }),
  setStartDate: startDate => set({ startDate }),
  setEndDate: endDate => set({ endDate }),
}));

export default useCalendarStore;
