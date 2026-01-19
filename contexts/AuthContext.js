import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Role hierarchy - higher number = more permissions
export const ROLES = {
  customer: 1,
  staff: 2,
  location_admin: 3,
  super_admin: 4,
};

// Mock users for development
const DEV_USERS = {
  super_admin: {
    id: 'dev-super-admin',
    email: 'admin@example.com',
    role: 'super_admin',
    name: 'Super Admin (Dev)',
  },
  location_admin: {
    id: 'dev-location-admin',
    email: 'manager@example.com',
    role: 'location_admin',
    name: 'Location Manager (Dev)',
  },
  staff: {
    id: 'dev-staff',
    email: 'staff@example.com',
    role: 'staff',
    name: 'Staff Member (Dev)',
  },
  customer: {
    id: 'dev-customer',
    email: 'customer@example.com',
    role: 'customer',
    name: 'Customer (Dev)',
  },
};

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  // Check if we're in development mode
  const isDev = __DEV__ || process.env.EXPO_PUBLIC_DEV_AUTO_LOGIN === 'true';

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user && !isDevMode) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (!isDevMode) {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isDevMode]);

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !isDevMode) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Fetch profile error:', error);
      // Create default profile if none exists
      setProfile({ role: 'customer' });
    }
  }

  // ==========================================
  // AUTH FUNCTIONS
  // ==========================================

  async function signUp(email, password, additionalData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signOut() {
    try {
      setIsDevMode(false);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async function resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // ==========================================
  // DEV MODE FUNCTIONS
  // ==========================================

  function enableDevMode(role = 'super_admin') {
    if (!isDev) {
      console.warn('Dev mode is only available in development');
      return;
    }
    const mockUser = DEV_USERS[role];
    setIsDevMode(true);
    setUser(mockUser);
    setProfile(mockUser);
    setLoading(false);
  }

  function switchDevRole(role) {
    if (!isDev || !isDevMode) return;
    const mockUser = DEV_USERS[role];
    setUser(mockUser);
    setProfile(mockUser);
  }

  function disableDevMode() {
    setIsDevMode(false);
    setUser(null);
    setProfile(null);
    checkSession(); // Check for real session
  }

  // ==========================================
  // PERMISSION HELPERS
  // ==========================================

  function hasRole(requiredRole) {
    if (!profile?.role) return false;
    return ROLES[profile.role] >= ROLES[requiredRole];
  }

  function isAdmin() {
    return hasRole('location_admin');
  }

  function isSuperAdmin() {
    return profile?.role === 'super_admin';
  }

  const value = {
    // State
    user,
    profile,
    loading,
    isDevMode,
    isDev,

    // Auth functions
    signUp,
    signIn,
    signOut,
    resetPassword,

    // Dev functions
    enableDevMode,
    switchDevRole,
    disableDevMode,

    // Permission helpers
    hasRole,
    isAdmin,
    isSuperAdmin,

    // Constants
    ROLES,
    DEV_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
