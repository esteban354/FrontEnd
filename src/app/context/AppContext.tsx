import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../data/domain";
import { authApi } from "../services/api";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    authApi.me()
      .then(setCurrentUser)
      .catch(() => {
        localStorage.removeItem("auth_token");
        setCurrentUser(null);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);
      localStorage.setItem("auth_token", response.token);
      setCurrentUser(response.user);
      return true;
    } catch {
      setCurrentUser(null);
      localStorage.removeItem("auth_token");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
