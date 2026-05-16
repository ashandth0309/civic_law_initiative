import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Topbar from './components/public/Topbar';
import Navbar from './components/public/Navbar';
import HomePage from './pages/public/HomePage';
import ApplyPage from './pages/public/ApplyPage';
import PreSurveyPage from './pages/public/PreSurveyPage';
import PostSurveyPage from './pages/public/PostSurveyPage';
import AdminLogin from './pages/auth/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ApplicantsPage from './pages/admin/ApplicantsPage';
import WorkshopsPage from './pages/admin/WorkshopsPage';
import TeamPage from './pages/admin/TeamPage';
import AttendancePage from './pages/admin/AttendancePage';
import MediaPage from './pages/admin/MediaPage';
import ReportsPage from './pages/admin/ReportsPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar />
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/apply" element={<PublicLayout><ApplyPage /></PublicLayout>} />
          <Route path="/pre-survey" element={<PublicLayout><PreSurveyPage /></PublicLayout>} />
          <Route path="/post-survey" element={<PublicLayout><PostSurveyPage /></PublicLayout>} />

          {/* Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="workshops" element={<WorkshopsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
