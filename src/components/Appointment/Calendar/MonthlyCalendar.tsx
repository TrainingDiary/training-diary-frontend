import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DayCellMountArg, DayHeaderContentArg } from '@fullcalendar/core';
import styled from 'styled-components';
import { format } from 'date-fns';

const FullCalendarWrapper = styled.div`
  box-shadow: 0 1px 4px 1px ${({ theme }) => theme.colors.gray300};

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

    &:hover,
    &:focus,
    &:not(:disabled):active {
      background-color: ${({ theme }) => theme.colors.main200};
      color: ${({ theme }) => theme.colors.main500};
      box-shadow: none;
    }
  }

  .fc-dayGridMonth-view {
    padding: 15px 0;
    font-family: 'Roboto';
    font-weight: 500;
    font-style: normal;
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
    padding: 2px 3px;
    border-radius: 3px;
  }

  .fc-daygrid-day-number.fc-has-event-number {
    background-color: ${({ theme }) => theme.colors.main400};
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

const events = [
  { title: 'event 1', date: '2024-07-25' },
  { title: 'event 2', date: '2024-07-17' },
];

const dayCellDidMount = (info: DayCellMountArg) => {
  const eventDates = events.map((event) => event.date);
  const formattedDate = format(info.date, 'yyyy-MM-dd');
  if (eventDates.includes(formattedDate)) {
    const dayNumberElement = info.el.querySelector('.fc-daygrid-day-number');
    if (dayNumberElement) {
      dayNumberElement.classList.add('fc-has-event-number');
    }
  }
};

const MonthlyCalendar: React.FC = () => {
  return (
    <FullCalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin]}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        fixedWeekCount={false}
        height="auto"
        dayHeaderContent={dayHeaderContent}
        events={events}
        dayCellDidMount={dayCellDidMount}
      />
    </FullCalendarWrapper>
  );
};

export default MonthlyCalendar;
