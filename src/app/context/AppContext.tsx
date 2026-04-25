import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, USERS, Role } from "../data/mockData";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, role?: Role) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: (role: Role) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_USERS: Record<Role, User> = {
  admin: USERS[0],
  organizador: USERS[1],
  instructor: USERS[2],
  aprendiz: USERS[3],
  general: USERS[4],
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, role?: Role): boolean => {
    if (role) {
      setCurrentUser(DEMO_USERS[role]);
      return true;
    }
    const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const switchRole = (role: Role) => {
    setCurrentUser(DEMO_USERS[role]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        switchRole,
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
