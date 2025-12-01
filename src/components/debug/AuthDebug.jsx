// src/components/AuthDebug.jsx
import { useAuth } from "../../contexts/AuthContext";

export function AuthDebug() {
  const { user, profile, isLoading, isAuthenticated } = useAuth();

  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          background: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px",
          fontSize: "12px",
          zIndex: 9999,
          maxWidth: "300px",
        }}
      >
        <div>
          <strong>Auth Debug:</strong>
        </div>
        <div>Loading: {isLoading ? "Yes" : "No"}</div>
        <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
        <div>User: {user?.email || "None"}</div>
        <div>Profile: {profile ? "Loaded" : "None"}</div>
        <div>User ID: {user?.id || "None"}</div>
      </div>
    );
  }

  return null;
}
