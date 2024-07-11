import React, { useState } from 'react';
import styled from 'styled-components';

import MonthlyCalendar from '@components/Appointment/Calendar/MonthlyCalendar';
import ButtonContainer from '@components/Appointment/ButtonContainer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
    </Wrapper>
  );
};

export default MonthlyContent;
