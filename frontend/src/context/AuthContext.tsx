import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets/assets";
import toast from "react-hot-toast";
import api from "../configs/api";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (user: { email: string; password: string }) => void;
  signUp: (user: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  login: () => {},
  signUp: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (data.user) {
        setUser(data.user as IUser);
        setIsLoggedIn(true);
      }

      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (data.user) {
        setUser(data.user as IUser);
        setIsLoggedIn(true);
      }

      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");

      setUser(null);
      setIsLoggedIn(false);

      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/auth/verify");

      if (data.user) {
        setUser(data.user as IUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    login,
    signUp,
    logout,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
