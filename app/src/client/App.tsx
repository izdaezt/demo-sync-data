import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './api';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function Protected({ children }: { children: JSX.Element }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><DashboardPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
