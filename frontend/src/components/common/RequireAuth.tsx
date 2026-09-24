import { useAuth } from 'providers/AuthProvider';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { authenticated, initializing, restoreSession } = useAuth();
  const [checkingSession, setCheckingSession] = useState(!authenticated);

  useEffect(() => {
    if (authenticated) {
      setCheckingSession(false);
      return;
    }

    void restoreSession().finally(() => setCheckingSession(false));
  }, [authenticated, restoreSession]);

  if (initializing || checkingSession) return null;
  return authenticated ? <Outlet /> : <Navigate to="/authentication/login" replace />;
};
export default RequireAuth;
