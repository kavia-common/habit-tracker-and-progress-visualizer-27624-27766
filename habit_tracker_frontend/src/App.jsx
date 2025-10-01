import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';
import { HabitsProvider } from './context/HabitsContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import CoverPage from './pages/CoverPage';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="app-root">
          <div className="main">
            <div className="content">
              <div className="card">
                <h2>Something went wrong</h2>
                <p>{String(this.state.error)}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <HabitsProvider>
        <BrowserRouter>
          <div className="app-root">
            <Sidebar />
            <div className="main">
              <Header />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Navigate to="/cover" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/cover" element={<CoverPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </HabitsProvider>
    </ErrorBoundary>
  );
}
