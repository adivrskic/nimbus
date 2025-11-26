// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // â­ Load remembered email on boot
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setRememberedEmail(savedEmail);
    }
  }, []);

  // â­ Initialize Supabase auth state on mount
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

      // â­ Store/remove remembered email
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

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Update email
  const updateEmail = async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      console.log('AuthContext: updatePassword called');
      console.log('AuthContext: User exists:', !!user);
      console.log('AuthContext: User ID:', user?.id);
      
      // Check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('AuthContext: Current session:', session ? 'Valid' : 'Invalid', sessionError);
      
      if (!session) {
        throw new Error('No active session. Please log in again.');
      }
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
      );
      
      const updatePromise = supabase.auth.updateUser({
        password: newPassword
      });
      
      console.log('AuthContext: Calling updateUser...');
      const { data, error } = await Promise.race([updatePromise, timeoutPromise]);

      console.log('AuthContext: updateUser response:', { data, error });

      if (error) {
        console.error('AuthContext: updateUser error:', error);
        throw error;
      }
      
      console.log('AuthContext: Password updated successfully');
      return { success: true };
    } catch (e) {
      console.error('AuthContext: updatePassword exception:', e);
      return { success: false, error: e.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // â­ Sign in with Google
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

  // â­ Sign in with GitHub
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

  // â­ Sign in with Facebook
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

  // â­ Sign in with Apple
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

  // â­ Sign in with LinkedIn
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
    rememberedEmail,   // â­ Exposed so AuthModal can auto-fill
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