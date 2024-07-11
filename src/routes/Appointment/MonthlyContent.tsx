import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

import MonthlyCalendar from '@components/Appointment/Calendar/MonthlyCalendar';
import ButtonContainer from '@components/Appointment/ButtonContainer';
import TimeTableContainer from '@components/Appointment/TimeTableContainer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray300};
  width: 100%;
`;

const MonthlyContent: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleButtonClick = (buttonType: string) => {
    if (selectedButton === buttonType) {
      setSelectedButton(null);
    } else {
      setSelectedButton(buttonType);
    }
  };

  return (
    <Wrapper>
      <MonthlyCalendar />
      <ButtonContainer
        onButtonClick={handleButtonClick}
        selectedButton={selectedButton}
      />

      {selectedButton && (
        <Fragment>
          <Divider />
          <TimeTableContainer />
        </Fragment>
      )}
    </Wrapper>
  );
};

export default MonthlyContent;
