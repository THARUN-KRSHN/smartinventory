import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";

export const AuthContext = createContext(null);

const TOKEN_KEYS = ["accessToken", "token", "jwt", "jwtToken"];

const getStoredToken = () => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

const getStoredShopId = () => localStorage.getItem("shop_id");

const clearStoredAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("jwt");
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("shop_id");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [shopId, setShopIdState] = useState(getStoredShopId);
  const [isInitializing, setIsInitializing] = useState(true);

  const setShopId = (nextShopId) => {
    if (nextShopId === undefined || nextShopId === null || nextShopId === "") {
      setShopIdState(null);
      localStorage.removeItem("shop_id");
      return;
    }

    const normalizedShopId = String(nextShopId);
    setShopIdState(normalizedShopId);
    localStorage.setItem("shop_id", normalizedShopId);
  };

  const login = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser || null);
    setToken(nextToken || null);

    if (nextToken) {
      localStorage.setItem("accessToken", nextToken);
    }

    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      localStorage.setItem("role", nextUser.role || "");
      setShopId(nextUser.shop_id);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setShopId(null);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setShopIdState(null);
    clearStoredAuth();
    window.location.href = "/login";
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const me = await apiRequest({
          method: "GET",
          url: "/auth/me",
        });

        if (!isMounted) return;

        setUser(me || null);
        if (me?.role !== undefined) {
          localStorage.setItem("role", me.role || "");
        }
        setShopId(me?.shop_id);
      } catch (error) {
        if (!isMounted) return;

        if (error?.response?.status === 401) {
          setUser(null);
          setToken(null);
          setShopIdState(null);
          clearStoredAuth();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      shopId,
      isInitializing,
      login,
      setShopId,
      logout,
    }),
    [user, token, shopId, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
