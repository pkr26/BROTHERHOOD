import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../common/Loading';
import logger from '../../utils/logger';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authTimeout, setAuthTimeout] = useState(false);

  // Timeout protection for loading state
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        logger.error('ProtectedRoute auth check timeout', {
          path: location.pathname,
          requireAuth
        });
        setAuthTimeout(true);
        toast.error('Authentication check timed out. Please try again.');
      }, 10000); // 10 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [loading, location.pathname, requireAuth]);

  // Show loader while checking authentication
  if (loading && !authTimeout) {
    return <PageLoader message="Checking authentication..." />;
  }

  // If timeout occurred, redirect to login
  if (authTimeout) {
    return <Navigate to="/login" replace />;
  }

  // If route requires auth and user is not authenticated
  if (requireAuth && !user) {
    logger.info('Redirecting unauthenticated user to login', {
      attemptedPath: location.pathname,
      redirectTo
    });
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If route requires no auth (login/register pages) and user is authenticated
  if (!requireAuth && user) {
    // Redirect to the intended page or feed
    const from = location.state?.from?.pathname || '/feed';
    logger.debug('Redirecting authenticated user from public route', {
      from: location.pathname,
      to: from,
      userId: user?.id
    });
    return <Navigate to={from} replace />;
  }

  return children;
};

export default ProtectedRoute;