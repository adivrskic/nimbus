import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [rememberedEmail, setRememberedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [justVerifiedEmail, setJustVerifiedEmail] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());

  const isInitializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isTabVisibleRef = useRef(true);
  const pendingAuthActionsRef = useRef([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setRememberedEmail(savedEmail);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;

      if (!document.hidden && pendingAuthActionsRef.current.length > 0) {
        setTimeout(() => {
          if (pendingAuthActionsRef.current.length > 0) {
            refreshSession();
            pendingAuthActionsRef.current = [];
          }
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const setLoadingSafe = (loading) => {
    if (isTabVisibleRef.current) {
      isLoadingRef.current = loading;
      setIsLoading(loading);
    }
  };

  const validateSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        setUser(null);
        setProfile(null);
        setUserTokens(0);
        return false;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setUser(null);
        setProfile(null);
        setUserTokens(0);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Session validation error:", err);
      setUser(null);
      setProfile(null);
      setUserTokens(0);
      return false;
    } finally {
      setLoadingSafe(false);
    }
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setUser(null);
        setProfile(null);
        setUserTokens(0);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        await loadUserProfile(user.id);
      } else {
        setUser(null);
        setProfile(null);
        setUserTokens(0);
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setUser(null);
      setProfile(null);
      setUserTokens(0);
    } finally {
      setLoadingSafe(false);
    }
  };

  const refreshTokens = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("tokens")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error refreshing tokens:", error);
        return;
      }

      const tokens = data?.tokens ?? 0;
      setUserTokens(tokens);

      if (profile) {
        setProfile((prev) => ({ ...prev, tokens }));
      }
    } catch (err) {
      console.error("Token refresh error:", err);
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    let active = true;
    let timeoutId = null;
    let authSubscription = null;

    const initializeAuth = async () => {
      try {
        if (!isTabVisibleRef.current) {
          setTimeout(() => {
            if (active) initializeAuth();
          }, 1000);
          return;
        }

        setLoadingSafe(true);

        // Single getSession() call — this reads from local storage first (fast),
        // then validates with the server if needed. No separate getUser() roundtrip.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          setProfile(null);
          setUserTokens(0);
          if (active) setLoadingSafe(false);
          return;
        }

        if (session && !session.access_token) {
          console.warn("Invalid session detected — forcing cleanup.");
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setUserTokens(0);
          if (active) setLoadingSafe(false);
          return;
        }

        // Check for email verification callback
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const token = urlParams.get("token");

        if (type === "signup" && token) {
          setJustVerifiedEmail(true);

          const { data: verificationData, error: verificationError } =
            await supabase.auth.verifyOtp({
              token_hash: token,
              type: "signup",
            });

          if (verificationError) {
            console.error("Email verification error:", verificationError);
          } else if (verificationData?.user) {
            setUser(verificationData.user);
            await loadUserProfile(verificationData.user.id);

            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } else if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        setProfile(null);
        setUserTokens(0);
      } finally {
        if (active) {
          setLoadingSafe(false);
        }
      }
    };

    initializeAuth();

    let authChangeTimeout = null;
    const handleAuthStateChange = async (event, session) => {
      if (authChangeTimeout) {
        clearTimeout(authChangeTimeout);
      }

      authChangeTimeout = setTimeout(async () => {
        if (!active) return;

        if (!isTabVisibleRef.current) {
          pendingAuthActionsRef.current.push({ event, session });
          return;
        }

        setLoadingSafe(true);
        setLastAuthCheck(Date.now());

        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          setUser(null);
          setProfile(null);
          setUserTokens(0);
          setJustVerifiedEmail(false);
          localStorage.removeItem("rememberedEmail");
          setRememberedEmail(null);
        } else if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);

          if (event === "SIGNED_IN") {
            setJustVerifiedEmail(false);
          } else if (event === "USER_UPDATED") {
          }
        } else {
          setUser(null);
          setProfile(null);
          setUserTokens(0);
        }

        setLoadingSafe(false);
      }, 100);
    };

    authSubscription = supabase.auth.onAuthStateChange(handleAuthStateChange);

    const processPendingAuthActions = () => {
      if (pendingAuthActionsRef.current.length > 0 && isTabVisibleRef.current) {
        const actions = [...pendingAuthActionsRef.current];
        pendingAuthActionsRef.current = [];

        if (actions.length > 0) {
          const lastAction = actions[actions.length - 1];
          handleAuthStateChange(lastAction.event, lastAction.session);
        }
      }
    };

    const checkSession = async () => {
      if (user && active && isTabVisibleRef.current) {
        const isValid = await validateSession();
        if (!isValid) {
          setUser(null);
          setProfile(null);
          setUserTokens(0);
        }
      }
    };

    timeoutId = setInterval(checkSession, 10 * 60 * 1000);

    return () => {
      active = false;
      isInitializedRef.current = false;
      if (authSubscription?.subscription) {
        authSubscription.subscription.unsubscribe();
      }
      if (timeoutId) clearInterval(timeoutId);
      if (authChangeTimeout) clearTimeout(authChangeTimeout);
    };
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return await createUserProfile(userId);
        }
        console.error("Profile load error:", error);
        return null;
      }

      setProfile(data);

      setUserTokens(data?.tokens ?? 0);

      return data;
    } catch (err) {
      console.error("Profile load error:", err);
      return null;
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: userData?.user?.email,
          full_name: userData?.user?.user_metadata?.full_name || null,
          tokens: 20,
        })
        .select()
        .single();

      if (error) {
        console.error("Profile creation error:", error);
        return null;
      }

      setProfile(data);
      setUserTokens(data?.tokens ?? 20);
      return data;
    } catch (err) {
      console.error("Profile creation error:", err);
      return null;
    }
  };

  const signup = async (email, password, fullName) => {
    try {
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

      if (data?.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message:
            "Please check your email to confirm your account. You'll be able to sign in after verification.",
        };
      }

      if (data?.user && data.session) {
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
      setLoadingSafe(true);
      setUser(null);
      setProfile(null);
      setUserTokens(0);
      setRememberedEmail(null);
      localStorage.removeItem("rememberedEmail");
      setJustVerifiedEmail(false);

      if (typeof window !== "undefined") {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes("supabase") || key.includes("sb-")) {
            localStorage.removeItem(key);
          }
        });
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
      } else {
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.warn("Session still exists after logout, forcing cleanup");
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }
      }

      window.location.href = "/";
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
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

      if (data?.tokens !== undefined) {
        setUserTokens(data.tokens);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      supabase.auth
        .updateUser({
          password: newPassword,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Background password update error:", error);
          } else {
          }
        });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true };
    } catch (e) {
      console.error("Update password exception:", e);
      return {
        success: false,
        error: e.message || "Failed to update password",
      };
    }
  };

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

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

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

  const clearJustVerifiedFlag = () => {
    setJustVerifiedEmail(false);
  };

  const value = {
    user,
    profile,
    userTokens,
    refreshTokens,
    rememberedEmail,
    isLoading,
    isAuthenticated: !!user && !!user.id,
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
    setLoadingSafe,
    signInWithGitHub,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
