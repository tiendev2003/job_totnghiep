import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import RecruiterLayout from '@/components/layout/RecruiterLayout';
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

// Recruiter pages
const RecruiterDashboard = lazy(() => import('@/pages/recruiter/Dashboard'));
const RecruiterJobs = lazy(() => import('@/pages/recruiter/Jobs'));
const CreateJob = lazy(() => import('@/pages/recruiter/CreateJob'));
const EditJob = lazy(() => import('@/pages/recruiter/EditJob'));
const RecruiterCandidates = lazy(() => import('@/pages/recruiter/Candidates'));
const RecruiterApplications = lazy(() => import('@/pages/recruiter/Applications'));
const RecruiterInterviews = lazy(() => import('@/pages/recruiter/Interviews'));
const RecruiterMessages = lazy(() => import('@/pages/recruiter/Messages'));
const RecruiterSubscription = lazy(() => import('@/pages/recruiter/Subscription'));
const RecruiterAnalytics = lazy(() => import('@/pages/recruiter/Analytics'));
const RecruiterProfile = lazy(() => import('@/pages/recruiter/Profile'));
const RecruiterServicePlans = lazy(() => import('@/pages/recruiter/ServicePlans'));
const RecruiterPayments = lazy(() => import('@/pages/recruiter/Payments'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const UsersManagement = lazy(() => import('@/pages/admin/UsersManagement'));
const JobsManagement = lazy(() => import('@/pages/admin/JobsManagement'));
const JobCategories = lazy(() => import('@/pages/admin/JobCategories'));
const ReportsManagement = lazy(() => import('@/pages/admin/ReportsManagement'));
const Payments = lazy(() => import('@/pages/admin/Payments'));
const ServicePlans = lazy(() => import('@/pages/admin/ServicePlans'));
const Subscriptions = lazy(() => import('@/pages/admin/Subscriptions'));
const EmailTemplates = lazy(() => import('@/pages/admin/EmailTemplates'));
const Notifications = lazy(() => import('@/pages/admin/Notifications'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const Maintenance = lazy(() => import('@/pages/admin/Maintenance'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

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
    ],
  },
  // Recruiter routes (protected) - Separate layout
  {
    path: 'recruiter',
    element: <ProtectedRoute allowedRoles={['recruiter']} />,
    children: [
      {
        index: true,
        element: <Navigate to="/recruiter/dashboard" replace />,
      },
      {
        path: '',
        element: <RecruiterLayout />,
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
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <RecruiterJobs />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/create',
            element: (
              <SuspenseWrapper>
                <CreateJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'candidates',
            element: (
              <SuspenseWrapper>
                <RecruiterCandidates />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'applications',
            element: (
              <SuspenseWrapper>
                <RecruiterApplications />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'interviews',
            element: (
              <SuspenseWrapper>
                <RecruiterInterviews />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'messages',
            element: (
              <SuspenseWrapper>
                <RecruiterMessages />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'subscription',
            element: (
              <SuspenseWrapper>
                <RecruiterSubscription />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <SuspenseWrapper>
                <RecruiterAnalytics />
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
          {
            path: 'service-plans',
            element: (
              <SuspenseWrapper>
                <RecruiterServicePlans />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payments',
            element: (
              <SuspenseWrapper>
                <RecruiterPayments />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  // Admin routes (protected) - Separate from main layout
  {
    path: 'admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'users',
            element: (
              <SuspenseWrapper>
                <UsersManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <JobsManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'job-categories',
            element: (
              <SuspenseWrapper>
                <JobCategories />
              </SuspenseWrapper>
            ),
          },
          
          {
            path: 'reports',
            element: (
              <SuspenseWrapper>
                <ReportsManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payments',
            element: (
              <SuspenseWrapper>
                <Payments />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'service-plans',
            element: (
              <SuspenseWrapper>
                <ServicePlans />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'subscriptions',
            element: (
              <SuspenseWrapper>
                <Subscriptions />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'email-templates',
            element: (
              <SuspenseWrapper>
                <EmailTemplates />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'notifications',
            element: (
              <SuspenseWrapper>
                <Notifications />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <SuspenseWrapper>
                <Analytics />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'maintenance',
            element: (
              <SuspenseWrapper>
                <Maintenance />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <Settings />
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
