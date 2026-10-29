import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "../types/auth";
import { login as loginApi, logout as logoutApi } from "../api_services/authApi";
import { readValue, removeValue, saveValue } from "../helpers/localStorage";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<AuthUser>(token);

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = readValue("authToken");
    const savedUser = savedToken ? decodeToken(savedToken) : null;

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    } else {
      removeValue("authToken");
    }

    setIsLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const response = await loginApi(username, password);

    if (!response.token) {
      throw new Error(response.message);
    }

    const decoded = decodeToken(response.token);

    if (!decoded) {
      throw new Error("Token nije validan.");
    }

    saveValue("authToken", response.token);
    setToken(response.token);
    setUser(decoded);
    return decoded;
  }

  async function logout() {
    try {
  if (token) {
    await logoutApi(token);
  }
} finally {
  removeValue("authToken");
  setToken(null);
  setUser(null);
}}

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth mora biti korišćen unutar AuthProvider.");
  }

  return context;
}