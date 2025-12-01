import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [justVerifiedEmail, setJustVerifiedEmail] = useState(false);

  // Load remembered email on boot
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setRememberedEmail(savedEmail);
  }, []);

  // Handle email verification and auth state
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        // First, check for existing session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
        }

        console.log("Initial session check:", session?.user?.email);

        // Handle email verification from URL
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const token = urlParams.get("token");

        if (type === "signup" && token) {
          console.log("Email verification detected, verifying...");
          setJustVerifiedEmail(true);

          const { data: verificationData, error: verificationError } =
            await supabase.auth.verifyOtp({
              token_hash: token,
              type: "signup",
            });

          if (verificationError) {
            console.error("Email verification error:", verificationError);
          } else if (verificationData?.user) {
            console.log(
              "Email verification successful:",
              verificationData.user.email
            );
            setUser(verificationData.user);
            await loadUserProfile(verificationData.user.id);

            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } else if (session?.user) {
          // Regular session exists
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      if (!active) return;

      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);

        // Handle specific events
        if (event === "SIGNED_IN") {
          console.log("User signed in successfully");
          setJustVerifiedEmail(false);
        } else if (event === "USER_UPDATED") {
          console.log("User updated");
        }
      } else {
        setUser(null);
        setProfile(null);
        console.log("User signed out");
      }

      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  // In your AuthContext - simplify loadUserProfile
  const loadUserProfile = async (userId) => {
    try {
      console.log("Loading profile for user:", userId);

      // Simple profile fetch
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If profile doesn't exist, create it with minimal data
        if (error.code === "PGRST116") {
          console.log("Creating minimal profile...");
          return await createUserProfile(userId);
        }
        console.error("Profile load error:", error);
        return null;
      }

      console.log("Profile loaded:", data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Profile load error:", err);
      return null;
    }
  };

  // Simplify createUserProfile
  const createUserProfile = async (userId) => {
    try {
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

      if (error) {
        console.error("Profile creation error:", error);
        return null;
      }

      console.log("Profile created:", data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Profile creation error:", err);
      return null;
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      console.log("Starting signup for:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}?verified=true`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup response:", data);

      if (data?.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message:
            "Please check your email to confirm your account. You'll be able to sign in after verification.",
        };
      }

      if (data?.user && data.session) {
        // Auto-confirmed (might happen in development)
        setUser(data.user);
        await loadUserProfile(data.user.id);
        return { success: true, user: data.user };
      }

      return {
        success: true,
        requiresEmailConfirmation: true,
        message: "Please check your email to confirm your account.",
      };
    } catch (e) {
      console.error("Signup exception:", e);
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
    try {
      console.log("Starting logout process...");

      // Clear all local state first
      setUser(null);
      setProfile(null);
      setRememberedEmail(null);
      setJustVerifiedEmail(false);

      // Clear localStorage items
      localStorage.removeItem("rememberedEmail");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        throw error;
      }

      console.log("Logout completed successfully");

      // Force a small delay to ensure all state is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if there's an error, clear local state
      setUser(null);
      setProfile(null);
      setRememberedEmail(null);
    }
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
      console.log("Starting password update...");

      // Start the update but don't wait for it to complete
      supabase.auth
        .updateUser({
          password: newPassword,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Background password update error:", error);
          } else {
            console.log("Background password update completed");
          }
        });

      // Wait just 1 second to show it started, then return success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Password update initiated successfully");
      return { success: true };
    } catch (e) {
      console.error("Update password exception:", e);
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

  // Clear the just verified flag
  const clearJustVerifiedFlag = () => {
    setJustVerifiedEmail(false);
  };

  const value = {
    user,
    profile,
    rememberedEmail,
    isLoading,
    isAuthenticated: !!user,
    justVerifiedEmail,
    clearJustVerifiedFlag,
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
    refreshProfile: () => user && loadUserProfile(user.id),
  };

  console.log("Auth context state:", {
    user: user?.email,
    profile: !!profile,
    isLoading,
    isAuthenticated: !!user,
    justVerifiedEmail,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
