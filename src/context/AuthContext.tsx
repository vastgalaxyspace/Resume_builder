"use client";

import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth, googleProvider, loadFirebaseAnalytics } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadFirebaseAnalytics();

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      if (name.trim()) {
        await updateProfile(credentials.user, {
          displayName: name.trim(),
        });
      }
    },
    [],
  );

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/account-exists-with-different-credential") {
        const credential = GoogleAuthProvider.credentialFromError(error);
        if (credential) {
          throw new Error("An account already exists with this email. Sign in with your original method first.");
        }
      }

      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [loading, login, loginWithGoogle, logout, register, resetPassword, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
