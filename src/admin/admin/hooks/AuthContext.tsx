import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi, tokens } from "../api/client";

interface AuthUser {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (entity: string, action: string) => boolean;
  canAccess: (entity: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.sub,
      email: payload.email,
      isSuperAdmin: payload.isSuperAdmin,
      permissions: payload.permissions || [],
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokens.getAccess();
    if (token) {
      const parsed = parseToken(token);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    tokens.set(data.accessToken, data.refreshToken);
    const parsed = parseToken(data.accessToken);
    setUser(parsed);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (entity: string, action: string) => {
      if (!user) return false;
      if (user.isSuperAdmin) return true;
      return user.permissions.includes(`${entity}:${action}`);
    },
    [user],
  );

  const canAccess = useCallback(
    (entity: string) => {
      if (!user) return false;
      if (user.isSuperAdmin) return true;
      return ["read", "create", "update", "delete"].some((action) =>
        user.permissions.includes(`${entity}:${action}`),
      );
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
