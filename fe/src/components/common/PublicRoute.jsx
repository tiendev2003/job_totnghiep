import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    // Redirect to appropriate dashboard based on role
    const redirectPaths = {
      admin: '/admin/dashboard',
      recruiter: '/recruiter/dashboard',
      candidate: '/candidate/dashboard',
    };
    
    return <Navigate to={redirectPaths[user.role] || '/'} replace />;
  }

  return children;
};

export default PublicRoute;
