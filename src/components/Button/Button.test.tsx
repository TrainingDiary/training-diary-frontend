import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Button from './Button';

// Button이 텍스트를 렌더링하는지 테스트
test('renders button with text', () => {
  render(<Button text="Click m" onClick={() => {}} />);
  const buttonElement = screen.getByText(/Click me/i);
  expect(buttonElement).toBeInTheDocument();
});
