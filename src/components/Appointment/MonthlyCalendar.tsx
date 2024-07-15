import { useState } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DayCellMountArg, DayHeaderContentArg } from '@fullcalendar/core';
import { format } from 'date-fns';

import { hexToRgba } from 'src/utils/hexToRgba';

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

const updateDayCell = (
  info: DayCellMountArg,
  selectedButton: string | null,
  selectedDates: string[],
  scheduledDates: string[],
  reservedDates: string[]
) => {
  const formattedDate = format(info.date, 'yyyy-MM-dd');
  const dayNumberElement = info.el.querySelector('.fc-daygrid-day-number');

  if (!dayNumberElement) return;

  if (selectedButton === null) {
    dayNumberElement.classList.add('active-enabled');

    if (reservedDates.includes(formattedDate)) {
      dayNumberElement.classList.add('fc-reserved-number');
    }
  }

  if (selectedButton === 'open' && scheduledDates.includes(formattedDate)) {
    dayNumberElement.classList.add('fc-has-event-number');
  }

  if (selectedDates.includes(formattedDate)) {
    dayNumberElement.classList.add('fc-selected-number');
  }
};

interface MonthlyCalendarProps {
  data: {
    scheduledDates: string[];
    reservedDates: string[];
  };
  selectedButton: string | null;
  selectedDates: string[];
  initialDate: Date | null;
  onDateClick: (date: Date) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  data,
  selectedButton,
  selectedDates,
  initialDate,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate || new Date()
  );

  const { scheduledDates, reservedDates } = data;
  const formattedSelectedDates = selectedDates.map((date) =>
    format(date, 'yyyy-MM-dd')
  );

  const handleDateClick = (info: { date: Date }) => {
    const formattedDate = format(info.date, 'yyyy-MM-dd');

    if (
      selectedButton === null ||
      selectedButton === 'register' ||
      (selectedButton == 'open' && !scheduledDates.includes(formattedDate))
    ) {
      onDateClick(info.date);
      setCurrentDate(info.date);
    }
  };

  return (
    <FullCalendarWrapper>
      <FullCalendar
        key={formattedSelectedDates.join() + selectedButton}
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        initialDate={currentDate}
        fixedWeekCount={false}
        height="auto"
        dayHeaderContent={dayHeaderContent}
        dayCellDidMount={(info) =>
          updateDayCell(
            info,
            selectedButton,
            formattedSelectedDates,
            scheduledDates,
            reservedDates
          )
        }
        dateClick={handleDateClick}
      />
    </FullCalendarWrapper>
  );
};

export default MonthlyCalendar;
