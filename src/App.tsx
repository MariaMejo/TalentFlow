import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Jobs } from './pages/Jobs';
import { JobDetail } from './pages/JobDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { CreateJob } from './pages/CreateJob';
import { EditJob } from './pages/EditJob';
import { MyApplications } from './pages/MyApplications';
import { Applicants } from './pages/Applicants';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Candidate Protected Routes */}
            <Route
              path="candidate/dashboard"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="candidate/applications"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="candidate/profile"
              element={
                <ProtectedRoute allowedRole="candidate">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Employer Protected Routes */}
            <Route
              path="employer/dashboard"
              element={
                <ProtectedRoute allowedRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="employer/jobs/create"
              element={
                <ProtectedRoute allowedRole="employer">
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="employer/jobs/:id/edit"
              element={
                <ProtectedRoute allowedRole="employer">
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="employer/applicants"
              element={
                <ProtectedRoute allowedRole="employer">
                  <Applicants />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
