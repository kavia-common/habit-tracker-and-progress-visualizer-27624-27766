import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders app header greeting', () => {
  render(<App />);
  // Header component shows "Welcome back"
  const el = screen.getByText(/Welcome back/i);
  expect(el).toBeInTheDocument();
});
