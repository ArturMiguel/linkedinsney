"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  picture: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setLoading: (loading: boolean) => void
  signIn: (credential: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get<User>("/api/v1/auth/me").then(({ data }) => {
      setUser(data);
    }).catch(() => {
      setUser(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const signIn = async (credential: string) => {
    const { data } = await axios.post("/api/v1/auth/signin", {
      type: "GOOGLE",
      google: {
        credential
      },
      keepConected: false,
    });

    setUser(data.user);
  };

  const signOut = async () => {
    await axios.post("/api/v1/auth/signout");
    setUser(null);
  };

  return (
    <>
      {loading == true ? <Loading /> : <></>}
      <AuthContext.Provider value={{ user, loading, setLoading, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
