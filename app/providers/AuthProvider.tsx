"use client";

import http from "@/lib/ky";
import { useEffect, useState, createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

type SessionResponse = {
  user: User;
};

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  const hydrateSession = async () => {
    try {
      const sessionRes = await http.get("auth/session").json<SessionResponse>();
      setUser(sessionRes.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 401) {
        try {
          await http.get("auth/refresh");

          // After refresh, try fetching session again
          const refreshedSession = await http
            .get("auth/session")
            .json<SessionResponse>();
          setUser(refreshedSession.user);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      hydrateSession();
    }

    const interval = setInterval(() => {
      hydrateSession();
    }, 1000 * 60 * 5); // refresh every 5 minutes

    return () => clearInterval(interval);
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
