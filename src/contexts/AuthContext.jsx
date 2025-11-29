import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Load remembered email on boot
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setRememberedEmail(savedEmail);
  }, []);

  // Initialize Supabase auth state
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile (with auto-create if missing)
  const loadUserProfile = async (userId) => {
    try {
      console.log("Loading profile for user:", userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist (error code 406 or PGRST116), create it
        if (error.code === "PGRST116" || error.message.includes("0 rows")) {
          console.log("Profile not found, creating new profile...");
          return await createUserProfile(userId);
        }
        throw error;
      }

      console.log("Profile loaded:", data);
      setProfile(data);
    } catch (err) {
      console.error("Profile load error:", err.message, err);
      // Don't throw - just log the error and continue
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (userId) => {
    try {
      console.log("Creating profile for user:", userId);

      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userData?.user?.email,
          full_name: userData?.user?.user_metadata?.full_name || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Profile created:", data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Profile creation error:", err.message, err);
    }
  };

  // Signup
  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      if (data?.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: "Please check your email to confirm your account",
        };
      }
      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { persistSession: rememberMe },
      });
      if (error) throw error;

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

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("No active session. Please log in again.");
      }
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return {
        success: false,
        error: e.message || "Failed to update password",
      };
    }
  };

  // Reset password (sends email)
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // OAuth providers
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // **Helper to set session from URL hash**
  const setSessionFromHash = async (hash) => {
    const params = Object.fromEntries(
      hash
        .replace(/^#/, "")
        .split("&")
        .map((kv) => kv.split("=").map(decodeURIComponent))
    );
    if (params.access_token) {
      await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });
      setShowResetPassword(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const value = {
    user,
    profile,
    rememberedEmail,
    isLoading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    updateProfile,
    updatePassword,
    resetPassword,
    showResetPassword,
    setShowResetPassword,
    setSessionFromHash,
    supabase,
  };

  console.log("auth context: ", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
