import React from 'react';
import { getMonth, getYear } from 'date-fns';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';

interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DatePickerWrapper = styled.div`
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
    text-align: right;
    outline: none;
    transition: border-color 0.3s;
  }
  .react-datepicker__header {
    background-color: ${({ theme }) => theme.colors.main300};
  }
`;

const CustomHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Month = styled.span`
  font-size: 1.4rem;
`;

const YearSelect = styled.select`
  margin-left: 5px;
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
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
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
            <div>
              <Month>{MONTHS[getMonth(date)]}</Month>
              <YearSelect
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </YearSelect>
            </div>
            <div>
              <MonthButton
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                {'<'}
              </MonthButton>
              <MonthButton
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                {'>'}
              </MonthButton>
            </div>
          </CustomHeaderContainer>
        )}
      />
    </DatePickerWrapper>
  );
};

export default Calendar;
