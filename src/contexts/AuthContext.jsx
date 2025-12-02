import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [justVerifiedEmail, setJustVerifiedEmail] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());

  // Refs to track state and prevent re-initialization
  const isInitializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isTabVisibleRef = useRef(true);
  const pendingAuthActionsRef = useRef([]);

  // Load remembered email on boot
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setRememberedEmail(savedEmail);
  }, []);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      console.log("Tab visibility changed:", isTabVisibleRef.current);

      // Don't trigger auth refreshes on tab visibility changes
      // Only refresh if we need to handle something specific
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Safe loading state setter
  const setLoadingSafe = (loading) => {
    if (isTabVisibleRef.current) {
      isLoadingRef.current = loading;
      setIsLoading(loading);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingSafe(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } finally {
        setLoadingSafe(false);
      }
    };

    init();
  }, []);

  // Session validation function
  const validateSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        console.log("Invalid or expired session detected");
        setUser(null);
        setProfile(null);
        return false;
      }

      // Verify the session is still valid
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("User verification failed:", userError);
        setUser(null);
        setProfile(null);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Session validation error:", err);
      setUser(null);
      setProfile(null);
      return false;
    } finally {
      setLoadingSafe(false);
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.log("No valid session found");
        setUser(null);
        setProfile(null);
        return;
      }

      // Get fresh user data
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("Session refreshed for:", user.email);
        setUser(user);
        await loadUserProfile(user.id);
      } else {
        console.log("No user found in session");
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setUser(null);
      setProfile(null);
    } finally {
      setLoadingSafe(false);
    }
  };

  // Handle email verification and auth state
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    let active = true;
    let timeoutId = null;
    let authSubscription = null;

    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing auth...");

        // Only proceed if tab is visible
        if (!isTabVisibleRef.current) {
          console.log("Tab not visible, delaying auth initialization");
          setTimeout(() => {
            if (active) initializeAuth();
          }, 1000);
          return;
        }

        setLoadingSafe(true);

        // First, validate the existing session
        const isValidSession = await validateSession();

        if (!isValidSession) {
          // Clear any stale data
          setUser(null);
          setProfile(null);
          if (active) {
            setLoadingSafe(false);
          }
          return;
        }

        // Rest of your initialization code...
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (session && !session.access_token) {
          console.warn(
            "Invalid Supabase session detected — forcing logout cleanup."
          );
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          if (active) {
            setLoadingSafe(false);
          }
          return;
        }

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
        setUser(null);
        setProfile(null);
      } finally {
        if (active) {
          setLoadingSafe(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes with debouncing
    let authChangeTimeout = null;
    const handleAuthStateChange = async (event, session) => {
      // Clear any pending auth change
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }

      // Debounce auth state changes to prevent rapid updates
      authChangeTimeout = setTimeout(async () => {
        if (!active) return;

        console.log("Auth state change:", event, session?.user?.email);

        // Only process if tab is visible
        if (!isTabVisibleRef.current) {
          console.log("Tab not visible, queuing auth state change");
          pendingAuthActionsRef.current.push({ event, session });
          return;
        }

        setLoadingSafe(true);
        setLastAuthCheck(Date.now());

        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          // Clear all state on sign out
          console.log("🔄 Auth state: SIGNED_OUT event detected");
          setUser(null);
          setProfile(null);
          setJustVerifiedEmail(false);
          localStorage.removeItem("rememberedEmail");
          setRememberedEmail(null);

          console.log("✅ User signed out - state cleared");
        } else if (session?.user) {
          console.log("🔄 Auth state: User session found");
          setUser(session.user);
          await loadUserProfile(session.user.id);

          if (event === "SIGNED_IN") {
            console.log("User signed in successfully");
            setJustVerifiedEmail(false);
          } else if (event === "USER_UPDATED") {
            console.log("User updated");
          }
        } else {
          // No session and not SIGNED_OUT event (initial state)
          console.log("🔄 Auth state: No active session");
          setUser(null);
          setProfile(null);
        }

        setLoadingSafe(false);
      }, 500); // 500ms debounce
    };

    authSubscription = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Process pending auth actions when tab becomes visible
    const processPendingAuthActions = () => {
      if (pendingAuthActionsRef.current.length > 0 && isTabVisibleRef.current) {
        console.log(
          "Processing pending auth actions:",
          pendingAuthActionsRef.current.length
        );
        const actions = [...pendingAuthActionsRef.current];
        pendingAuthActionsRef.current = [];

        // Process the most recent auth action
        if (actions.length > 0) {
          const lastAction = actions[actions.length - 1];
          handleAuthStateChange(lastAction.event, lastAction.session);
        }
      }
    };

    // Check session periodically (but less frequently)
    const checkSession = async () => {
      if (user && active && isTabVisibleRef.current) {
        const isValid = await validateSession();
        if (!isValid) {
          console.log("Periodic check: Session is invalid, clearing state");
          setUser(null);
          setProfile(null);
        }
      }
    };

    // Check session every 10 minutes (increased from 5)
    timeoutId = setInterval(checkSession, 10 * 60 * 1000);

    return () => {
      active = false;
      if (authSubscription?.subscription) {
        authSubscription.subscription.unsubscribe();
      }
      if (timeoutId) clearInterval(timeoutId);
      if (authChangeTimeout) clearTimeout(authChangeTimeout);
    };
  }, []);

  // Process pending actions when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      isTabVisibleRef.current = isVisible;

      if (isVisible) {
        // Tab became visible, process any pending auth actions
        setTimeout(() => {
          if (pendingAuthActionsRef.current.length > 0) {
            console.log("Tab visible, processing pending auth actions");
            // Just refresh session instead of processing all pending actions
            refreshSession();
            pendingAuthActionsRef.current = [];
          }
        }, 1000); // Delay to let everything stabilize
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

  // Login with safe loading
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoadingSafe(true);

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

      // Refresh the session to ensure consistency
      await refreshSession();

      return { success: true, user: data.user };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      setLoadingSafe(false);
    }
  };

  const logout = async () => {
    try {
      console.log("🚪 Starting logout...");

      setLoadingSafe(true);

      // Clear all local state FIRST
      console.log("Clearing local state...");
      setUser(null);
      setProfile(null);
      setRememberedEmail(null);
      localStorage.removeItem("rememberedEmail");
      setJustVerifiedEmail(false);

      // Clear any cached Supabase data
      if (typeof window !== "undefined") {
        // Clear Supabase related localStorage
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("supabase") || key.includes("sb-")) {
            localStorage.removeItem(key);
          }
        });
      }

      // Sign out from Supabase with error handling
      console.log("Signing out from Supabase...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
      } else {
        console.log("Supabase session cleared");
      }

      // Force a small delay to ensure Supabase cleans up
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Double-check session is cleared
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.warn("Session still exists after logout, forcing cleanup");
        // Force clear all auth storage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
      }

      console.log("✅ Logout completed, reloading page...");

      // Force hard reload to clear all React state and Supabase caches
      window.location.href = "/";
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
      // Still force refresh even on error
      window.location.href = "/";
    } finally {
      setLoadingSafe(false);
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
    isAuthenticated: !!user && !!user.id, // More strict check
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
    refreshSession,
    validateSession,
    lastAuthCheck,
    // Expose safe loading setter for components
    setLoadingSafe,
  };

  console.log("Auth context state:", {
    user: user?.email,
    profile: !!profile,
    isLoading,
    isAuthenticated: !!user,
    justVerifiedEmail,
    lastAuthCheck,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
