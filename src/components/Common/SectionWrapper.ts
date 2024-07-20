import styled from 'styled-components';

export const SectionWrapper = styled.div`
  width: 100%;
  max-width: calc(100% - 40px);
  margin: 0 auto;

  @media ${({ theme }) => theme.media.mobile} {
    max-width: calc(100% - 20px);
  }
`;
