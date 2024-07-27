import { useEffect } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, DayHeaderContentArg } from '@fullcalendar/core';
import {
  addMonths,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';

import { hexToRgba } from 'src/utils/hexToRgba';
import useCalendarStore from 'src/stores/calendarStore';

const FullCalendarWrapper = styled.div`
  box-shadow: 0 4px 4px ${({ theme }) => hexToRgba(theme.colors.black, 0.25)};

  .fc-toolbar.fc-header-toolbar {
    margin-bottom: 0;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.main500};
  }

  .fc-toolbar-title {
    font-family: 'NanumSquareExtraBold';
    font-size: 2.4rem;
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 0;
  }

  .fc-button-primary {
    background-color: transparent;
    border-radius: 5px;
    font-size: 1.4rem;
    padding: 14px 12px;
    border: none;

    &:hover {
      background-color: transparent;
    }

    &:not(:disabled):active {
      background-color: ${({ theme }) => theme.colors.main200};
      color: ${({ theme }) => theme.colors.main500};
    }

    &:not(:disabled):active:focus {
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .fc-dayGridMonth-view {
    padding: 15px 0;
    font-family: 'NanumSquareBold';
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.gray900};
  }

  .fc-day-sun {
    color: ${({ theme }) => theme.colors.red400};
  }

  .fc-daygrid-day-top {
    justify-content: center;
    padding-top: 20px;
  }

  .fc-daygrid-day.fc-day-today {
    background-color: transparent;
  }

  .fc-daygrid-day-number {
    display: inline-block;
    text-align: center;
    width: 60%;
    padding: 2px 3px;
    border-radius: 3px;
    cursor: pointer;
  }

  .fc-daygrid-day-number.active-enabled:active {
    background-color: ${({ theme }) => theme.colors.gray200};
  }

  .fc-daygrid-day-number.fc-reserved-number {
    background-color: ${({ theme }) => theme.colors.main400};
    color: ${({ theme }) => theme.colors.white};

    &:active {
      background-color: ${({ theme }) => theme.colors.main500};
    }
  }

  .fc-daygrid-day-number.fc-has-event-number {
    background-color: ${({ theme }) => theme.colors.gray500};
    color: ${({ theme }) => theme.colors.gray200};
    cursor: not-allowed;
  }

  .fc-daygrid-day-number.fc-selected-number {
    background-color: ${({ theme }) => theme.colors.main600};
    color: ${({ theme }) => theme.colors.white};
  }

  .fc-daygrid-day-number.fc-today {
    border: 1px solid ${({ theme }) => theme.colors.main800};
  }

  .fc-scrollgrid,
  table,
  td,
  th {
    border: none;
  }

  .fc-daygrid-day-events {
    display: none;
  }
`;

const dayHeaderContent = (arg: DayHeaderContentArg) => {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return dayNames[arg.date.getUTCDay()];
};

interface MonthlyCalendarProps {
  data: {
    scheduledDates: string[];
    reservedDates: string[];
    reservedAndAppliedDates: {
      startDate: string;
      notAllowedTimes: string[];
    }[];
  };
  selectedButton: string | null;
  selectedDates: string[];
  onDateClick: (date: Date) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  data,
  selectedButton,
  selectedDates,
  onDateClick,
}) => {
  const { scheduledDates, reservedDates } = data;
  const { selectedDate, setSelectedDate, setStartDate, setEndDate } =
    useCalendarStore();

  const handleDateClick = (info: { date: Date }) => {
    const formattedDate = format(info.date, 'yyyy-MM-dd');

    if (
      selectedButton === 'open' &&
      isBefore(new Date(formattedDate), new Date())
    ) {
      return;
    }

    if (
      selectedButton === 'register' &&
      isBefore(new Date(formattedDate), startOfDay(new Date()))
    ) {
      return;
    }

    if (
      selectedButton === null ||
      selectedButton === 'register' ||
      (selectedButton == 'open' && !scheduledDates.includes(formattedDate))
    ) {
      onDateClick(info.date);
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    const hasFirstDayOfMonth = arg.start.getDate() === 1;

    if (!hasFirstDayOfMonth) {
      const nextMonthStart = startOfMonth(addMonths(arg.start, 1));
      setSelectedDate(nextMonthStart);
    } else {
      setSelectedDate(arg.start);
    }

    setStartDate(format(arg.start, 'yyyy-MM-dd'));
    setEndDate(format(arg.end, 'yyyy-MM-dd'));
  };

  useEffect(() => {
    const updateCells = () => {
      const dayCells = document.querySelectorAll('.fc-daygrid-day');
      dayCells.forEach(dayCell => {
        const dayNumberElement = dayCell.querySelector(
          '.fc-daygrid-day-number'
        );
        const date = dayCell.getAttribute('data-date');
        if (!date || !dayNumberElement) return;
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');

        dayNumberElement.classList.remove(
          'active-enabled',
          'fc-reserved-number',
          'fc-has-event-number',
          'fc-selected-number',
          'fc-today'
        );

        if (selectedButton === null) {
          if (isSameDay(new Date(date), startOfDay(new Date()))) {
            dayNumberElement.classList.add('fc-today');
          }

          dayNumberElement.classList.add('active-enabled');
          if (reservedDates.includes(formattedDate)) {
            dayNumberElement.classList.add('fc-reserved-number');
          }
        }

        if (
          selectedButton === 'open' &&
          isBefore(new Date(formattedDate), new Date())
        ) {
          dayNumberElement.classList.add('fc-has-event-number');
        }

        if (
          selectedButton === 'register' &&
          isBefore(new Date(formattedDate), startOfDay(new Date()))
        ) {
          dayNumberElement.classList.add('fc-has-event-number');
        }

        if (
          selectedButton === 'open' &&
          scheduledDates.includes(formattedDate)
        ) {
          dayNumberElement.classList.add('fc-has-event-number');
        }

        if (selectedDates.includes(formattedDate)) {
          dayNumberElement.classList.add('fc-selected-number');
        }
      });
    };

    updateCells();
  }, [data, selectedButton, selectedDates]);

  return (
    <FullCalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        initialDate={selectedDate}
        fixedWeekCount={false}
        height="auto"
        dayHeaderContent={dayHeaderContent}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
      />
    </FullCalendarWrapper>
  );
};

export default MonthlyCalendar;
