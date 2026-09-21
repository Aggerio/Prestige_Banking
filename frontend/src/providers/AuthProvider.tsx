import { login as loginRequest, logout as logoutRequest } from 'api/banking';
import { apiError, setAccessToken } from 'api/client';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { refreshAccessToken } from 'api/client';

type AuthContextValue = {
  authenticated: boolean;
  initializing: boolean;
  login: (customerId: number, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void refreshAccessToken()
      .then((accessToken) => setAuthenticated(Boolean(accessToken)))
      .finally(() => setInitializing(false));
  }, []);
  const login = async (customerId: number, password: string) => {
    try {
      const response = await loginRequest(customerId, password);
      setAccessToken(response.data.accessToken);
      setAuthenticated(true);
      setError(null);
    } catch (err) {
      setError(apiError(err));
      throw err;
    }
  };
  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
      setAuthenticated(false);
    }
  };
  return (
    <AuthContext.Provider value={{ authenticated, initializing, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
};
