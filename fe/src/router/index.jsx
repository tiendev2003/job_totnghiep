import { createBrowserRouter, RouterProvider } from 'react-router';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PublicRoute from '@/components/common/PublicRoute';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Jobs = lazy(() => import('@/pages/jobs/Jobs'));
const JobDetail = lazy(() => import('@/pages/jobs/JobDetail'));
const CandidateProfile = lazy(() => import('@/pages/candidate/Profile'));
const CandidateDashboard = lazy(() => import('@/pages/candidate/Dashboard'));
const RecruiterProfile = lazy(() => import('@/pages/recruiter/Profile'));
const RecruiterDashboard = lazy(() => import('@/pages/recruiter/Dashboard'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'jobs',
        element: (
          <SuspenseWrapper>
            <Jobs />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'jobs/:id',
        element: (
          <SuspenseWrapper>
            <JobDetail />
          </SuspenseWrapper>
        ),
      },
      // Auth routes (public only)
      {
        path: 'login',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Register />
            </SuspenseWrapper>
          </PublicRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <ForgotPassword />
            </SuspenseWrapper>
          </PublicRoute>
        ),
      },
      // Candidate routes (protected)
      {
        path: 'candidate',
        element: <ProtectedRoute allowedRoles={['candidate']} />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <CandidateDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <CandidateProfile />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      // Recruiter routes (protected)
      {
        path: 'recruiter',
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <RecruiterDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <RecruiterProfile />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      // Admin routes (protected)
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
