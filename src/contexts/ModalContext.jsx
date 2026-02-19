import { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext(null);

export function useModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModals must be used within ModalProvider");
  return ctx;
}

export function ModalProvider({ children }) {
  const [modals, setModals] = useState({
    auth: false,
    tokenPurchase: false,
    projects: false,
    legal: false,
    roadmap: false,
    support: false,
  });

  const [legalSection, setLegalSection] = useState(null);

  const open = useCallback((name, extra) => {
    if (name === "legal" && extra?.section) {
      setLegalSection(extra.section);
    }
    setModals((prev) => ({ ...prev, [name]: true }));
  }, []);

  const close = useCallback((name) => {
    if (name === "legal") {
      setLegalSection(null);
    }
    setModals((prev) => ({ ...prev, [name]: false }));
  }, []);

  // Convenience helpers so consumers don't need to know the string keys
  const openAuth = useCallback(() => open("auth"), [open]);
  const closeAuth = useCallback(() => close("auth"), [close]);

  const openTokenPurchase = useCallback(() => open("tokenPurchase"), [open]);
  const closeTokenPurchase = useCallback(() => close("tokenPurchase"), [close]);

  const openProjects = useCallback(() => open("projects"), [open]);
  const closeProjects = useCallback(() => close("projects"), [close]);

  const openLegal = useCallback(
    (section) => open("legal", { section }),
    [open]
  );
  const closeLegal = useCallback(() => close("legal"), [close]);

  const openRoadmap = useCallback(() => open("roadmap"), [open]);
  const closeRoadmap = useCallback(() => close("roadmap"), [close]);

  const openSupport = useCallback(() => open("support"), [open]);
  const closeSupport = useCallback(() => close("support"), [close]);

  return (
    <ModalContext.Provider
      value={{
        modals,
        legalSection,

        openAuth,
        closeAuth,
        openTokenPurchase,
        closeTokenPurchase,
        openProjects,
        closeProjects,
        openLegal,
        closeLegal,
        openRoadmap,
        closeRoadmap,
        openSupport,
        closeSupport,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
