import React from 'react';
import { getMonth, getYear } from 'date-fns';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export const DatePickerWrapper = styled.div`
  width: 100%;
  max-width: 220px;
  .react-datepicker-wrapper {
    width: 100%;
  }

  .datePicker {
    border: 1px solid ${({ theme }) => theme.colors.main500};
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray900};
    width: 100%;
    text-align: left;
    outline: none;
    transition: border-color 0.3s;
  }

  .react-datepicker-popper[data-placement^='bottom']
    .react-datepicker__triangle {
    fill: #d2f1e7;
    color: #d2f1e7;
    left: 80% !important;
  }

  .react-datepicker-popper {
    width: 100%;
    transform: none !important;
    top: calc(100% + 15px) !important;
  }

  .react-datepicker {
    font-family: 'NanumSquare';
    width: 100%;
    border-radius: 5px;
    border: solid 1px ${({ theme }) => theme.colors.gray400};

    .react-datepicker__month-container {
      width: 100%;

      .react-datepicker__header {
        background-color: ${({ theme }) => theme.colors.main300};
        padding: 8px;

        .react-datepicker__day-names {
          margin: 8px 0 0;
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
        }
      }

      .react-datepicker__month {
        margin: 10px 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .react-datepicker__day--outside-month {
          color: ${({ theme }) => theme.colors.gray500};
        }

        .react-datepicker__week {
          display: flex;
          justify-content: space-between;

          .react-datepicker__day--today {
            color: ${({ theme }) => theme.colors.main900};
          }

          .react-datepicker__day {
            font-size: 1.2rem;
            padding: 3px;
            line-height: 1;
            display: flex;
            justify-content: center;
          }

          .react-datepicker__day--selected {
            color: ${({ theme }) => theme.colors.white} !important;
          }
        }
      }
    }
  }
`;

const CustomHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Month = styled.span`
  font-size: 1.6rem;
`;

const YearSelect = styled.select`
  margin-left: 5px;
  padding: 5px 10px;
  border-radius: 3px;
  outline: none;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
  const YEARS = Array.from(
    { length: getYear(new Date()) + 1 - 1900 },
    (_, i) => getYear(new Date()) - i
  );
  const MONTHS = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <DatePickerWrapper className="datePickerWrapper">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="yyyy. MM. dd."
        className={'datePicker'}
        formatWeekDay={nameOfDay => nameOfDay.substring(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <CustomHeaderContainer>
            <MonthButton
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
            >
              {'<'}
            </MonthButton>
            <div>
              <Month>{MONTHS[getMonth(date)]}</Month>
              <YearSelect
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </YearSelect>
            </div>
            <MonthButton
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
            >
              {'>'}
            </MonthButton>
          </CustomHeaderContainer>
        )}
      />
    </DatePickerWrapper>
  );
};

export default Calendar;
