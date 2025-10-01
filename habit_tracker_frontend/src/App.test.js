import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders app root header', () => {
  render(<App />);
  const el = screen.getByText(/Welcome back/i);
  expect(el).toBeInTheDocument();
});
