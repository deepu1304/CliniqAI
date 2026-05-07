import { useState, useCallback } from 'react';
import { authApi } from '../services/api';
import type { AuthState, AuthUser, LoginCredentials } from '../types/auth';

// Why a custom hook? Keeps auth logic out of components entirely.
// Components just call login() and read user — no axios in JSX.
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const { data } = await authApi.login(credentials.email, credentials.password);

      const user: AuthUser = {
        ...data.user,
        role: credentials.role,
        token: data.access_token,
        tokenExpiry: Date.now() + 8 * 60 * 60 * 1000, // 8h
      };

      // Store token for the axios interceptor (see api.ts)
      localStorage.setItem('cliniqai_token', user.token);
      setState({ user, isLoading: false, error: null });
      return user;
    } catch (err: any) {
      const msg = err.response?.data?.detail ?? 'Login failed. Try again.';
      setState((s) => ({ ...s, isLoading: false, error: msg }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {}); // fire-and-forget
    localStorage.removeItem('cliniqai_token');
    setState({ user: null, isLoading: false, error: null });
  }, []);

  return { ...state, login, logout };
}