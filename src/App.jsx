import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './components/layout/RootLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Public Pages
import Landing from './pages/public/Landing';
import PublicMap from './pages/public/PublicMap';
import About from './pages/public/About';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetail from './pages/citizen/ComplaintDetail';
import Notifications from './pages/citizen/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminHotspots from './pages/admin/AdminHotspots';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/citizen'}
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Landing />} />
              <Route path="about" element={<About />} />
              <Route path="map" element={<PublicMap />} />
              <Route
                path="issue/:id"
                element={
                  <div className="pt-24 min-h-screen bg-slate-50">
                    <ComplaintDetail />
                  </div>
                }
              />
              <Route path="*" element={<Landing />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Citizen Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute role="citizen">
                  <DashboardLayout role="citizen" />
                </ProtectedRoute>
              }
            >
              <Route index element={<CitizenDashboard />} />
              <Route path="report" element={<ReportIssue />} />
              <Route path="complaints" element={<MyComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="*" element={<CitizenDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout role="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="complaints/:id" element={<ComplaintDetail />} />
              <Route path="hotspots" element={<AdminHotspots />} />
              <Route path="*" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
