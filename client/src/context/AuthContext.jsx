import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // ✅ Login with user normalization
  // AuthContext.js
const login = ({ token, user }) => {
    setUser({
        user_id: user.user_id,
        username: user.name || user.username,
        role: user.role,
        email: user.email,
    });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

  // ✅ Logout clears storage + state
  const logout = (navigate) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (navigate) navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
