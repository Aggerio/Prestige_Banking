import { useAuth } from 'providers/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { authenticated, initializing } = useAuth();
  if (initializing) return null;
  return authenticated ? <Outlet /> : <Navigate to="/authentication/login" replace />;
};
export default RequireAuth;
