
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/api/auth/me");
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setChecking(false); // stop showing spinner
      }
    };

    checkAuth();
  }, []); // runs only once on app load — no dependencies

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // still log out on frontend even if server request fails
    } finally {
      setIsLoggedIn(false);
    }
  };

  // Show spinner only while checking — not on every render
  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10
                        border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}