import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { addDays, format, subDays } from 'date-fns';

import { hexToRgba } from 'src/utils/hexToRgba';

const CalendarWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 20px;
  padding-bottom: 10px;
  cursor: grab;
`;

const CalendarItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  min-width: 40px;
  min-height: 62px;
  border-radius: 5px;
  font-family: 'NanumSquareBold';
  line-height: 1.2;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.main600 : theme.colors.gray100};
  box-shadow: ${({ theme, $isSelected }) =>
    $isSelected ? `0 4px 4px ${hexToRgba(theme.colors.main600, 0.5)}` : 'none'};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.white : theme.colors.gray900};
  cursor: pointer;
`;

const DayText = styled.span`
  font-size: 1.2rem;
`;

const DateText = styled.span`
  font-size: 1.6rem;
`;

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [week, setWeek] = useState<Date[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const generateInitialMonth = (date: Date) => {
    const week = [];
    for (let i = -15; i <= 15; i++) {
      week.push(addDays(date, i));
    }
    return week;
  };

  const scrollCenter = (date: Date, behavior: 'auto' | 'smooth' = 'smooth') => {
    const selectedItem = calendarRef.current?.querySelector(
      `[data-date="${format(date, 'yyyy-MM-dd')}"]`
    );

    if (selectedItem && calendarRef.current) {
      const itemRect = selectedItem.getBoundingClientRect();
      const calendarRect = calendarRef.current.getBoundingClientRect();
      const scrollPosition =
        itemRect.left +
        itemRect.width / 2 -
        calendarRect.left -
        calendarRect.width / 2;

      calendarRef.current.scrollBy({
        left: scrollPosition,
        behavior: behavior,
      });
    }
  };

  const onClickDate = (date: Date) => {
    if (isDragging.current) return;

    onDateChange(date);
    scrollCenter(date);
  };

  const onInfiniteScroll = () => {
    const scrollLeft = calendarRef.current?.scrollLeft || 0;
    const scrollWidth = calendarRef.current?.scrollWidth || 0;
    const clientWidth = calendarRef.current?.clientWidth || 0;

    if (scrollLeft <= 180) {
      const newDates: Date[] = [];
      for (let i = 1; i <= 15; i++) {
        newDates.push(subDays(week[0], i));
      }

      newDates.reverse();
      setWeek(prevWeek => [...newDates, ...prevWeek]);

      if (calendarRef.current) {
        calendarRef.current.scrollLeft += newDates.length * 60;
      }
    }

    if (scrollLeft + clientWidth + 1 >= scrollWidth) {
      const newDates: Date[] = [];
      for (let i = 1; i <= 15; i++) {
        newDates.push(addDays(week[week.length - 1], i));
      }
      setWeek(prevWeek => [...prevWeek, ...newDates]);
    }
  };

  const onWheelScroll = (e: WheelEvent) => {
    if (calendarRef.current) {
      e.preventDefault();
      calendarRef.current.scrollLeft += e.deltaY;
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (calendarRef.current?.offsetLeft || 0);
    scrollLeft.current = calendarRef.current?.scrollLeft || 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const x = e.pageX - (calendarRef.current?.offsetLeft || 0);
    const walk = x - startX.current;
    if (calendarRef.current) {
      calendarRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    setWeek(generateInitialMonth(selectedDate));
    setTimeout(() => scrollCenter(selectedDate, 'auto'), 0);

    const calendar = calendarRef.current;
    if (calendar) {
      calendar.addEventListener('wheel', onWheelScroll);
      calendar.addEventListener('mousedown', onMouseDown);
      calendar.addEventListener('mousemove', onMouseMove);
      calendar.addEventListener('mouseup', onMouseUp);
      calendar.addEventListener('mouseleave', onMouseUp);
      return () => {
        calendar.removeEventListener('wheel', onWheelScroll);
        calendar.removeEventListener('mousedown', onMouseDown);
        calendar.removeEventListener('mousemove', onMouseMove);
        calendar.removeEventListener('mouseup', onMouseUp);
        calendar.removeEventListener('mouseleave', onMouseUp);
      };
    }
  }, []);

  return (
    <CalendarWrapper ref={calendarRef} onScroll={onInfiniteScroll}>
      {week.map(day => {
        const isSelected =
          format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        return (
          <CalendarItem
            key={day.toISOString()}
            $isSelected={isSelected}
            onClick={() => onClickDate(day)}
            data-date={format(day, 'yyyy-MM-dd')}
          >
            <DayText>{format(day, 'EEE')}</DayText>
            <DateText>{format(day, 'dd')}</DateText>
          </CalendarItem>
        );
      })}
    </CalendarWrapper>
  );
};

export default WeeklyCalendar;
