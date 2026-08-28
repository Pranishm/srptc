import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import ReportIssue from './pages/ReportIssue';
import ExploreCampus from './pages/ExploreCampus';
import MyIssues from './pages/MyIssues';
import CampusAlerts from './pages/CampusAlerts';
import StudentImpact from './pages/StudentImpact';
import FacultyDashboard from './pages/FacultyDashboard'; // Staff / faculty console

// ── Technician portal (one route per operation) ─────────────────────────────
import TechCommandCenter from './pages/technician/TechCommandCenter';
import TechMyTasks from './pages/technician/TechMyTasks';
import TechPriorityQueue from './pages/technician/TechPriorityQueue';
import TechCompleted from './pages/technician/TechCompleted';
import TechTeam from './pages/technician/TechTeam';
import TechPerformance from './pages/technician/TechPerformance';

// ── Admin portal (one route per operation) ──────────────────────────────────
import AdminCommandCenter from './pages/admin/AdminCommandCenter';
import AdminLiveCampus from './pages/admin/AdminLiveCampus';
import AdminIssues from './pages/admin/AdminIssues';
import AdminPredictive from './pages/admin/AdminPredictive';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminStaffRoster from './pages/admin/AdminStaffRoster';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAlerts from './pages/admin/AdminAlerts';

import { useEffect } from 'react';
import { syncFromSupabase } from './utils/db';

function App() {
  useEffect(() => {
    syncFromSupabase();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/student" replace />} />

          {/* Student & staff */}
          <Route path="student" element={<StudentDashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="explore" element={<ExploreCampus />} />
          <Route path="my-issues" element={<MyIssues />} />
          <Route path="alerts" element={<CampusAlerts />} />
          <Route path="impact" element={<StudentImpact />} />
          <Route path="staff" element={<FacultyDashboard />} />

          {/* Technician portal */}
          <Route path="technician" element={<TechCommandCenter />} />
          <Route path="technician/tasks" element={<TechMyTasks />} />
          <Route path="technician/priority" element={<TechPriorityQueue />} />
          <Route path="technician/completed" element={<TechCompleted />} />
          <Route path="technician/team" element={<TechTeam />} />
          <Route path="technician/performance" element={<TechPerformance />} />

          {/* Admin portal */}
          <Route path="admin" element={<AdminCommandCenter />} />
          <Route path="admin/campus" element={<AdminLiveCampus />} />
          <Route path="admin/issues" element={<AdminIssues />} />
          <Route path="admin/ai" element={<AdminPredictive />} />
          <Route path="admin/feedback" element={<AdminFeedback />} />
          <Route path="admin/staff" element={<AdminStaffRoster />} />
          <Route path="admin/departments" element={<AdminDepartments />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/alerts" element={<AdminAlerts />} />
        </Route>

        {/* Redirect direct index.html access or any undefined routes to prevent blank screens */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
