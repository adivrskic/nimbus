// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐ Load remembered email on boot
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setRememberedEmail(savedEmail);
    }
  }, []);

  // ⭐ Initialize Supabase auth state on mount
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;

      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }

      setIsLoading(false);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile from Supabase
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Profile load error:", err.message);
    }
  };

  // Email/password signup
  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });

      if (error) throw error;

      if (data?.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'Please check your email to confirm your account'
        };
      }

      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Email/password login
  const login = async (email, password, rememberMe = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { persistSession: rememberMe }
      });

      if (error) throw error;

      // ⭐ Store/remove remembered email
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        setRememberedEmail(email);
      } else {
        localStorage.removeItem("rememberedEmail");
        setRememberedEmail(null);
      }

      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Update profile helpers…
  const updateProfile = async (updates) => { /* unchanged */ };
  const updateEmail = async (newEmail) => { /* unchanged */ };
  const updatePassword = async (newPassword) => { /* unchanged */ };

  const resetPassword = async (email) => { /* unchanged */ };

  // ⭐ Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ⭐ Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ⭐ Sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ⭐ Sign in with Apple
  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ⭐ Sign in with LinkedIn
  const signInWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',  // <-- Correct Supabase ID
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };


  const value = {
    user,
    profile,
    rememberedEmail,   // ⭐ Exposed so AuthModal can auto-fill
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProfile,
    updateEmail,
    updatePassword,
    resetPassword,
    signInWithGoogle,
    signInWithGitHub,
    signInWithFacebook,   
    signInWithApple,     
    signInWithLinkedIn,  
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
