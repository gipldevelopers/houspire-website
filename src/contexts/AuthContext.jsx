'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dataGet, dataPost } from '@/lib/frontend-data';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await dataGet('/auth/me');
      if (data?.user) {
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await dataPost('/auth/login', { email, password });
      if (data?.user && data?.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
        return { error: null };
      }
      return { error: new Error('Login failed') };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const data = await dataPost('/auth/signup', { email, password, name });
      if (data?.user && data?.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
        return { error: null };
      }
      return { error: new Error('Signup failed') };
    } catch (error) {
      return { error };
    }
  };

  const signup = async ({ email, password, name }) => {
    const result = await signUp(email, password, name);

    if (result?.error) {
      return {
        success: false,
        message: result.error.message || 'Signup failed',
      };
    }

    return {
      success: true,
      data: {
        requiresVerification: false,
        isExistingUser: false,
      },
    };
  };

  const verifyOtp = async () => ({
    success: true,
  });

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signup,
        verifyOtp,
        signOut,
        loading,
        isAdmin,
        emailVerified: user?.emailVerified || false,
        resendVerificationEmail: async () => {
          // TODO: Implement email verification
          return { success: false };
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

