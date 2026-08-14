import { createContext, useContext, useEffect, useState } from "react";

// Shared, header-triggerable modals: contact / settings / sign-out.
// Page-specific modals (Start a Return, Edit Profile) keep their own
// local state in their page component but still call closeAll() here
// so "only one modal open at a time" holds globally, matching the
// original script.js openModal() behavior.
const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null); // null | "contact" | "settings" | "signout"

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
  }, [activeModal]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") setActiveModal(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function openModal(name) {
    setActiveModal(name);
  }
  function closeModal() {
    setActiveModal(null);
  }

  return (
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
