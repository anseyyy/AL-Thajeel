"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  api,
  getAuthToken,
  setAuthData,
  getStoredUser,
  clearAuthData,
} from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify authentication
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        try {
          // Verify with backend
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            setAuthData(storedToken, res.user);
          }
        } catch (err) {
          console.warn("Session expired or invalid token:", err.message);
          clearAuthData();
          setUser(null);
          setToken(null);
        }
      } else {
        clearAuthData();
        setUser(null);
        setToken(null);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Protected route enforcement
  useEffect(() => {
    if (isLoading) return;

    const isAdminRoute = pathname?.startsWith("/admin/dashboard");
    const isLoginRoute = pathname === "/admin/login";

    const isUserAdmin = user && user.role === "admin";

    if (isAdminRoute && (!token || !isUserAdmin)) {
      router.replace("/admin/login");
    } else if (isLoginRoute && token && isUserAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [pathname, token, user, isLoading, router]);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      try {
        const data = await api.auth.login({ email, password });

        if (!data.success || !data.token) {
          throw new Error(data.message || "Login failed");
        }

        if (data.user?.role !== "admin") {
          throw new Error("Access denied. Admin privileges required.");
        }

        setAuthData(data.token, data.user);
        setToken(data.token);
        setUser(data.user);

        router.push("/admin/dashboard");
        return { success: true, user: data.user };
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  // Logout handler
  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setToken(null);
    router.replace("/admin/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && user?.role === "admin",
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
