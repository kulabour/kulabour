import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './layout/RequireAuth';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UsersTable from './components/UsersTable';
import BookingsTable from './components/BookingsTable';
import LiveMap from './pages/LiveMap';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<div className="p-8 h-full"><UsersTable /></div>} />
            <Route path="bookings" element={<div className="p-8 h-full"><BookingsTable /></div>} />
            <Route path="live-map" element={<div className="p-8 h-full"><LiveMap /></div>} />
            <Route path="settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
