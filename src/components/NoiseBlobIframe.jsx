import React, { useState, useEffect } from "react";

/**
 * NoiseBlobExternal - Loads blob from separate HTML file
 *
 * Put blob.html in your /public folder, then use this component.
 * The iframe loads completely independently - can't block main thread.
 */
export default function NoiseBlobExternal({
  backgroundColor = "#ffffff",
  color = "#ffffff",
  emissiveColor = "#0000ff",
  speed = 0.15,
  style = {},
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Don't even create iframe until page is loaded
  useEffect(() => {
    if (document.readyState === "complete") {
      setShouldLoad(true);
    } else {
      window.addEventListener("load", () => setShouldLoad(true), {
        once: true,
      });
    }
  }, []);

  // Listen for ready message
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === "blob-ready") {
        setLoaded(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const iframeSrc = `/blob.html?bg=${encodeURIComponent(
    backgroundColor
  )}&color=${encodeURIComponent(color)}&emissive=${encodeURIComponent(
    emissiveColor
  )}&speed=${speed}`;

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    >
      {/* Placeholder */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.8s ease-out",
        }}
      >
        <div
          style={{
            width: "min(400px, 60vw)",
            height: "min(400px, 60vw)",
            borderRadius: "50%",
            background: `radial-gradient(
              ellipse at 30% 30%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(200, 200, 255, 0.6) 30%,
              rgba(100, 100, 200, 0.3) 60%,
              rgba(50, 50, 150, 0.1) 80%,
              transparent 100%
            )`,
            filter: "blur(20px)",
            animation: "blobPulse 4s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes blobPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.02); }
          }
        `}</style>
      </div>

      {/* External iframe - truly separate */}
      {shouldLoad && (
        <iframe
          src={iframeSrc}
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "none",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.8s ease-in",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
