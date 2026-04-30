import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "@/lib/api";
import { type AuthUser } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (usernameORemail: string, password: string) => Promise<void>;
  register: (fullname: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← starts true, blocks render

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false); // no token, stop immediately
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token")) // bad token, clear it
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (usernameORemail: string, password: string) => {
    const res = await api.post("/auth/login", { usernameORemail, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (fullname: string, username: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { fullname, username, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
